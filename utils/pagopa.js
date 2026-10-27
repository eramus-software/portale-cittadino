import axios from "axios";

export const CHECKOUT_HOME = "https://checkout.pagopa.it/";

// Codici identificativi di un blocco pagoPA. Il blocco puo' arrivare come stringa
// JSON (colonna json salvata doppiamente codificata), con chiave camelCase o
// snake_case, oppure annidato sotto "pagopa_data" (come gestito dal backend).
function codiciDi(blocco) {
  let b = blocco;
  if (typeof b === "string") {
    try {
      b = JSON.parse(b);
    } catch {
      return [];
    }
  }
  if (!b || typeof b !== "object") return [];
  const codici =
    b.codiciIdentificativi || b.codici_identificativi || b.pagopa_data?.codiciIdentificativi;
  return Array.isArray(codici) ? codici.filter((c) => c && typeof c === "object") : [];
}

// Blocchi pagoPA in ordine di preferenza: prima quello del soggetto a cui e' stato
// stampato il verbale (stessa logica di Datapol::Verbale#pagopa_data_soggetto_stampa),
// poi gli altri, cosi' se il primo non ha avvisi validi si passa al successivo.
function blocchiPagopa(verbale) {
  const s = verbale.soggettostampa != null ? String(verbale.soggettostampa) : "";
  const stesso = (id) => s && id != null && String(id) === s;
  const preferito =
    (stesso(verbale.proprietario_id) && verbale.pagopa_data) ||
    (stesso(verbale.trasgressore_id) && verbale.pagopa_data_tr) ||
    (stesso(verbale.tutore_id) && verbale.pagopa_data_tu) ||
    (stesso(verbale.noleggio_id) && verbale.pagopa_data_no) ||
    null;
  return [
    preferito,
    verbale.pagopa_data_tr,
    verbale.pagopa_data,
    verbale.pagopa_data_tu,
    verbale.pagopa_data_no,
    verbale.pagopa_anonimous,
  ].filter(Boolean);
}

const scadenzaDi = (c) => c.dataScadenza || c.data_scadenza || c.scadenza;

// Codice avviso: dal qrCodeString se presente, altrimenti dallo IUV a 17 cifre
// con aux digit 3 (con IUV a 15 cifre servirebbe anche il codice di segregazione).
function codiceAvviso(c, qr) {
  if (/^\d{18}$/.test(qr[2])) return qr[2];
  const diretto = String(c.noticeCode || c.codiceAvviso || "");
  if (/^\d{18}$/.test(diretto)) return diretto;
  const iuv = String(c.iuv || "").trim();
  return /^\d{17}$/.test(iuv) ? `3${iuv}` : "";
}

// qrCodeString pagoPA: "PAGOPA|002|<codice avviso 18 cifre>|<CF ente 11 cifre>|<importo in centesimi>"
function avvisoDaCodice(c, cfEnte) {
  const qr = String(c.qrCodeString || "").split("|");
  const noticeNumber = codiceAvviso(c, qr);
  const fiscalCode = /^\d{11}$/.test(qr[3]) ? qr[3] : String(cfEnte || "").trim();
  const amount = Number(qr[4]) || Math.round(Number(c.importo)) || 0;
  if (!/^\d{18}$/.test(noticeNumber) || !/^\d{11}$/.test(fiscalCode) || amount <= 0) return null;
  return { noticeNumber, fiscalCode, amount, tipo: c.tipo_importo, scadenza: scadenzaDi(c) };
}

// Restituisce l'avviso da mettere nel carrello: tra quelli non scaduti, quello
// con l'importo piu' basso (es. ridotto prima del normale). Un solo avviso,
// perche' ridotto/normale/maggiorato sono alternativi tra loro.
export function avvisoPagabile(verbale) {
  if (!verbale) return null;

  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  for (const blocco of blocchiPagopa(verbale)) {
    const avvisi = codiciDi(blocco)
      .map((c) => avvisoDaCodice(c, verbale.codice_fiscale_ente_creditore))
      .filter(Boolean);
    if (!avvisi.length) continue;
    const validi = avvisi.filter((a) => !a.scadenza || new Date(a.scadenza) >= oggi);
    const candidati = validi.length ? validi : avvisi;
    return candidati.sort((a, b) => a.amount - b.amount)[0];
  }

  console.warn("[pagoPA] Nessun avviso valido nei blocchi del verbale", {
    soggettostampa: verbale.soggettostampa,
    cf_ente: verbale.codice_fiscale_ente_creditore,
    blocchi: {
      pagopa_data: verbale.pagopa_data,
      pagopa_data_tr: verbale.pagopa_data_tr,
      pagopa_data_tu: verbale.pagopa_data_tu,
      pagopa_data_no: verbale.pagopa_data_no,
      pagopa_anonimous: verbale.pagopa_anonimous,
    },
  });
  return null;
}

// OpenPOL AM: gli avvisi sono i record "pagamenti" PagoPA non ancora pagati
// (iuv, qrcode_string_pagopa, data_scadenza_pagopa); importi in centesimi.
export function avvisoPagabileAm(verbale, cfEnte) {
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  const avvisi = (verbale?.pagamenti || [])
    .filter((p) => !p.data_pagamento && (p.qrcode_string_pagopa || p.iuv))
    .map((p) =>
      avvisoDaCodice(
        {
          qrCodeString: p.qrcode_string_pagopa,
          iuv: p.iuv,
          importo: verbale.importo_totale,
          scadenza: p.data_scadenza_pagopa,
        },
        cfEnte
      )
    )
    .filter(Boolean);
  const validi = avvisi.filter((a) => !a.scadenza || new Date(a.scadenza) >= oggi);
  return (validi.length ? validi : avvisi)[0] || null;
}

// Crea il carrello su pagoPA Checkout (tramite /api/pagopa/carrello) e porta
// l'utente alla pagina di pagamento in una nuova scheda. Se non ci sono avvisi
// pagabili apre la home di Checkout, dove il codice avviso si inserisce a mano.
export async function apriCarrelloPagoPA(avviso, { companyName, description }) {
  // La scheda va aperta subito, nel click, altrimenti il browser la blocca come popup
  const tab = window.open("", "_blank");

  if (!avviso) {
    console.warn(
      "[pagoPA] Nessun avviso pagabile nel verbale (serve codice avviso 18 cifre, CF ente 11 cifre e importo): apro la home di Checkout"
    );
    if (tab) tab.location.href = CHECKOUT_HOME;
    else window.location.href = CHECKOUT_HOME;
    return;
  }

  try {
    const { data } = await axios.post("/api/pagopa/carrello", {
      paymentNotices: [
        {
          noticeNumber: avviso.noticeNumber,
          fiscalCode: avviso.fiscalCode,
          amount: avviso.amount,
          companyName: companyName.slice(0, 140),
          description: description.slice(0, 140),
        },
      ],
      returnUrl: window.location.origin + "/",
    });
    if (tab) tab.location.href = data.url;
    else window.location.href = data.url;
  } catch (error) {
    if (tab) tab.close();
    throw error;
  }
}
