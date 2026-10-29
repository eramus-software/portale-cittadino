import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
import dynamic from "next/dynamic";
import axios from "axios";
import { baseUrl } from "../utils/config";
import fileDownload from "js-file-download";
import { useRouter } from "next/router";
import {
  ArrowRight,
  Bell,
  CalendarEvent,
  CarFront,
  CashCoin,
  Download,
  ExclamationTriangle,
  FileEarmarkText,
  Flag,
  HouseDoor,
  InfoCircle,
  Journal,
  Megaphone,
  People,
  PersonBadge,
} from "react-bootstrap-icons";
import PagoPaButton from "../components/PagoPaButton";
import { apriCarrelloPagoPA, avvisoPagabile } from "../utils/pagopa";
import {
  ActionBar,
  BackLink,
  btnCls,
  DetailHero,
  DocumentList,
  EmailPrompt,
  EmptyNote,
  FooterActions,
  InfoGrid,
  MiniTable,
  PageShell,
  Plate,
  Section,
  SectionGrid,
  SubBlock,
  Totals,
  Violation,
  formatDate,
  formatEuro,
} from "../components/verbali/VerbaliUI";

const MyHeader = dynamic(() => import("../components/MyHeader"), {
  ssr: false,
});

const Footer = dynamic(() => import("../components/Footer"), { ssr: false });

const soggettoItems = (s) => [
  {
    label: "Nome e cognome",
    value: s.nome && s.cognome ? `${s.nome} ${s.cognome}` : s.ragione_sociale,
  },
  { label: "Codice fiscale", value: s.codfiscale, mono: true },
  { label: "Data di nascita", value: formatDate(s.data_nascita) },
];

const Verbale = () => {
  const router = useRouter();

  const getVerbale = async (id) => {
    const response = await axios.get(baseUrl() + `/verbali/${id}`, {
      headers: {
        "X-Api-Key": s, //the token is a variable which holds the token
      },
    });
    return response.data;
  };

  const getModuloDatiById = async (id) => {
    const response = await axios.get(
      baseUrl() + `/moduli_dati_conducentes/search`,
      {
        params: {
          filter_verbale_id: id,
        },

        headers: {
          "X-Api-Key": s, //the token is a variable which holds the token
        },
      }
    );
    return response.data;
  };

  const getDocumentiVerbale = async (id) => {
    const response = await axios.get(baseUrl() + `/verbali/${id}/documents`, {
      headers: {
        "X-Api-Key": s, //the token is a variable which holds the token
      },
    });
    return response.data;
  };

  const getFileVerbale = async (id, name, codice) => {
    const response = await axios.get(
      baseUrl() + `/documents/${id}?codiceunivoco=${codice}&file=${true}`,
      {
        headers: {
          "X-Api-Key": s, //the token is a variable which holds the token
        },
        responseType: "blob",
      }
    );
    fileDownload(response.data, name);
  };

  async function scaricaFile(e, documento) {
    e.preventDefault();
    await getFileVerbale(documento.id, documento.title, codiceVerbale);
  }

  const { codiceVerbale, s } = useAppContext();

  const [verbale, setVerbale] = useState(undefined);
  const [documentiVerbale, setDocumentiVerbale] = useState([]);
  const [controlloModulo, setControlloModulo] = useState(true);
  const [showInfoSana, setShowInfoSana] = useState(false);
  const [pagamentoInCorso, setPagamentoInCorso] = useState(false);
  const [errorePagamento, setErrorePagamento] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (codiceVerbale != null && codiceVerbale != "") {
        const result = await getVerbale(codiceVerbale);
        const modulo1 = await getModuloDatiById(result.id).catch((error) => {
          console.error("Errore nel caricamento dei moduli conducente:", error);
          return null;
        });
        const documenti = await getDocumentiVerbale(codiceVerbale);

        // Se i moduli non sono verificabili il pulsante resta disabilitato
        const moduliVerificati = Array.isArray(modulo1?.moduli);
        const moduli = moduliVerificati ? modulo1.moduli : [];
        const controlloPunti = (result.violazioni || []).some(
          (item) => Number(item?.punti) > 0
        );
        // Un nuovo modulo è consentito solo se tutti quelli già inviati sono
        // stati rifiutati: uno in attesa (tipo_lavorazione null) o accettato blocca
        const moduliTuttiRifiutati = moduli.every(
          (m) => m?.tipo_lavorazione === "Rifiutata"
        );

        if (
          !result.data_presentazione_documenti &&
          controlloPunti &&
          result.eseguito126 !== true &&
          moduliVerificati &&
          moduliTuttiRifiutati
        ) {
          setControlloModulo(false);
        }

        setVerbale(result);
        setDocumentiVerbale(documenti);
      } else {
        router.push("/login");
      }
    }
    fetchData().catch((error) => {
      console.error("Errore nel caricamento del verbale:", error);
      router.push("/login");
    });
  }, []);

  function openModuloDatiConducente(e) {
    e.preventDefault();
    const subdomain =
      localStorage.getItem("subdomain") === "castel-volturno"
        ? "castelvolturno"
        : localStorage.getItem("subdomain");

    window.open(
      `http://${subdomain}.sportelloente.it/posts/compilazioneistanze?tokenMdc=${codiceVerbale}`
    );
  }

  function openRichiestaAnnullamento(e) {
    e.preventDefault();
    const subdomain =
      localStorage.getItem("subdomain") === "castel-volturno"
        ? "castelvolturno"
        : localStorage.getItem("subdomain");
    window.open(
      `http://${subdomain}.sportelloente.it/posts/compilazioneistanze?tokenAnn=${codiceVerbale}`
    );
  }

  function openRichiestaRateizzazione(e) {
    e.preventDefault();
    const subdomain =
      localStorage.getItem("subdomain") === "castel-volturno"
        ? "castelvolturno"
        : localStorage.getItem("subdomain");
    window.open(
      `http://${subdomain}.sportelloente.it/posts/compilazioneistanze?tokenRat=${codiceVerbale}`
    );
  }

  async function openPagopaPagamenti(e) {
    e.preventDefault();
    setErrorePagamento("");
    setPagamentoInCorso(true);
    const subdomain = localStorage.getItem("subdomain") || "";
    try {
      await apriCarrelloPagoPA(avvisoPagabile(verbale), {
        companyName: `Comune di ${subdomain
          .split("-")
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
          .join(" ")}`,
        description: `Verbale ${verbale.protocollo || verbale.numeroserie || ""}`.trim(),
      });
    } catch (error) {
      console.error("Errore apertura carrello pagoPA:", error);
      setErrorePagamento(
        "Non è stato possibile avviare il pagamento. Riprova più tardi."
      );
    } finally {
      setPagamentoInCorso(false);
    }
  }

  function openSana(e) {
    e.preventDefault();
    window.open(`https://sana.interno.it/index.php`);
  }

  function goHome() {
    router.push("/");
  }

  function nuovaRicerca() {
    router.push("/login");
  }

  const violazioniVerbale = Array.isArray(verbale?.violazioni)
    ? verbale.violazioni
    : [];
  const sommaViolazioni = (campo) =>
    violazioniVerbale.reduce((sum, v) => sum + (Number(v?.[campo]) || 0), 0);
  const totaleRidotto = sommaViolazioni("importoridotto");
  const totaleRuolo = sommaViolazioni("importoruolo");
  const totalePunti = sommaViolazioni("punti");

  const azioniBloccate =
    verbale && [5, 10, 12, 15, 16].includes(verbale.status_verbale);

  return (
    <div>
      <MyHeader />
      {!verbale ? (
        <PageShell>
          <div
            className="d-flex flex-column align-items-center py-5"
            role="status"
            aria-live="polite"
          >
            <div className="spinner-border text-primary mb-3" />
            <span>Caricamento del verbale in corso...</span>
          </div>
        </PageShell>
      ) : (
        <PageShell>
          <BackLink onClick={nuovaRicerca}>Nuova ricerca</BackLink>

          <DetailHero
            eyebrow="Verbale Codice della Strada"
            title={
              verbale.protocollo
                ? `Protocollo ${verbale.protocollo}`
                : "Dettaglio verbale"
            }
            subtitle={
              verbale.numeroserie
                ? `N. ${verbale.numeroserie}${
                    verbale.blocchettario?.serie
                      ? ` · Serie ${verbale.blocchettario.serie}`
                      : ""
                  }`
                : ""
            }
            status={verbale.status?.name}
            stats={[
              { label: "Data verbale", value: formatDate(verbale.dataverbale) },
              { label: "Targa", value: verbale.targaveicolo },
              { label: "Totale ridotto", value: formatEuro(totaleRidotto) },
              { label: "Punti decurtati", value: totalePunti || "" },
            ]}
          />

          {/* Pulsanti azioni */}
          <ActionBar>
            <PagoPaButton
              small
              onClick={openPagopaPagamenti}
              loading={pagamentoInCorso}
            />

            <button
              className={btnCls()}
              onClick={openRichiestaRateizzazione}
              disabled={azioniBloccate}
            >
              <CalendarEvent /> Richiedi rateizzazione
            </button>

            <button
              className={btnCls()}
              onClick={openModuloDatiConducente}
              disabled={controlloModulo || verbale.eseguito126 === true}
            >
              <PersonBadge /> Inserisci dati conducente
            </button>

            <button
              className={btnCls()}
              onClick={() => setShowInfoSana(!showInfoSana)}
              aria-expanded={showInfoSana}
            >
              <Megaphone /> Visualizza ricorso Prefettura
            </button>

            <button
              className={btnCls("danger")}
              onClick={openRichiestaAnnullamento}
              disabled={azioniBloccate}
            >
              <Flag /> Segnala anomalia
            </button>
          </ActionBar>

          {errorePagamento ? (
            <div className="alert alert-danger" role="alert">
              {errorePagamento}
            </div>
          ) : null}

          {showInfoSana ? (
            <EmailPrompt>
              <div className="d-flex align-items-start" style={{ gap: 12 }}>
                <InfoCircle className="flex-shrink-0 mt-1" />
                <div>
                  <p className="font-weight-bold mb-1">Informazioni SANA</p>
                  <p className="mb-1">
                    Attraverso il portale SANA potrà visualizzare il ricorso
                    presentato alla Prefettura riferito alla sanzione
                    amministrativa notificata.
                  </p>
                  <p className="mb-2">
                    Una volta aperto il portale dovrà cliccare sulla voce
                    “Sistema informativo sanzionatorio amministrativo delle
                    Prefetture”, poi “SANA – per il cittadino” ed inserire i
                    dati inerenti al ricorso.
                  </p>
                  <button
                    type="button"
                    className={btnCls("primary")}
                    onClick={openSana}
                  >
                    Vai al sito <ArrowRight />
                  </button>
                </div>
              </div>
            </EmailPrompt>
          ) : null}

          <SectionGrid>
            {/* Violazioni e importi */}
            <Section
              icon={ExclamationTriangle}
              title="Violazioni contestate"
              count={violazioniVerbale.length}
              full
            >
              {violazioniVerbale.length > 0 ? (
                <>
                  {violazioniVerbale.map((item, index) => (
                    <Violation
                      key={index}
                      index={index + 1}
                      description={item.descrizione}
                      chips={[
                        {
                          label: "Ridotto",
                          value: formatEuro(item.importoridotto || 0),
                        },
                        {
                          label: "Ruolo",
                          value: formatEuro(item.importoruolo || 0),
                        },
                        {
                          label: "Punti",
                          value: item.punti ? `−${item.punti}` : "",
                          warn: true,
                        },
                      ]}
                    />
                  ))}
                  <SubBlock title="Totali">
                    <Totals
                      tiles={[
                        {
                          label: "Totale importo ridotto",
                          value: formatEuro(totaleRidotto),
                          accent: true,
                        },
                        {
                          label: "Totale importo ruolo",
                          value: formatEuro(totaleRuolo),
                        },
                        {
                          label: "Punti decurtati",
                          value: totalePunti ? String(totalePunti) : "0",
                        },
                      ]}
                    />
                  </SubBlock>
                </>
              ) : (
                <EmptyNote>Nessuna violazione presente.</EmptyNote>
              )}
            </Section>

            {/* Veicolo */}
            <Section icon={CarFront} title="Veicolo">
              <InfoGrid
                items={[
                  {
                    label: "Targa",
                    value: verbale.targaveicolo ? (
                      <Plate value={verbale.targaveicolo} />
                    ) : (
                      ""
                    ),
                  },
                  { label: "Tipo targa", value: verbale.tipotarga },
                  { label: "Tipo veicolo", value: verbale.tipoveicolo },
                  {
                    label: "Immatricolazione",
                    value: formatDate(verbale.dataimmatricolazione),
                  },
                  {
                    label: "Scadenza revisione",
                    value: formatDate(verbale.datarevisione),
                  },
                  {
                    label: "Scadenza assicurazione",
                    value: formatDate(verbale.dataassicurazione),
                  },
                ]}
              />
            </Section>

            {/* Documenti */}
            <Section
              icon={FileEarmarkText}
              title="Documenti"
              count={documentiVerbale.length}
            >
              {documentiVerbale.length > 0 ? (
                <DocumentList
                  icon={FileEarmarkText}
                  actionIcon={Download}
                  docs={documentiVerbale.map((item, index) => ({
                    key: item.id || index,
                    name: item.title,
                    onClick: (e) => scaricaFile(e, item),
                  }))}
                />
              ) : (
                <EmptyNote>Nessun documento disponibile.</EmptyNote>
              )}
            </Section>

            {/* Blocchettario */}
            <Section icon={Journal} title="Blocchettario">
              <InfoGrid
                items={[
                  { label: "Protocollo", value: verbale.protocollo, mono: true },
                  { label: "Numero", value: verbale.numeroserie },
                  { label: "Serie", value: verbale.blocchettario?.serie },
                  {
                    label: "Descrizione",
                    value: verbale.blocchettario?.descrizione,
                    full: true,
                  },
                ]}
              />
            </Section>

            {/* Comunicazione dati conducente */}
            <Section icon={PersonBadge} title="Comunicazione dati conducente">
              <InfoGrid
                items={[
                  {
                    label: "Data presentazione documenti",
                    value:
                      formatDate(verbale.data_presentazione_documenti) ||
                      "Non ancora presentati",
                  },
                ]}
              />
            </Section>

            {/* Soggetti */}
            <Section icon={People} title="Soggetti" full>
              <SubBlock title="Proprietario">
                {verbale.proprietario ? (
                  <InfoGrid items={soggettoItems(verbale.proprietario)} />
                ) : (
                  <EmptyNote>Nessuna informazione per il proprietario.</EmptyNote>
                )}
              </SubBlock>
              <SubBlock title="Trasgressore">
                {verbale.trasgressore ? (
                  <InfoGrid items={soggettoItems(verbale.trasgressore)} />
                ) : (
                  <EmptyNote>Nessuna informazione per il trasgressore.</EmptyNote>
                )}
              </SubBlock>
              <SubBlock title="Tutore">
                {verbale.tutore ? (
                  <InfoGrid items={soggettoItems(verbale.tutore)} />
                ) : (
                  <EmptyNote>Nessun tutore associato.</EmptyNote>
                )}
              </SubBlock>
            </Section>

            {/* Pagamenti */}
            <Section
              icon={CashCoin}
              title="Pagamenti"
              count={verbale.pagamenti?.length}
              full
              flush
            >
              <MiniTable
                empty="Non risultano pagamenti registrati."
                rows={verbale.pagamenti}
                columns={[
                  {
                    key: "data",
                    label: "Data",
                    render: (p) => formatDate(p.data_pagamento),
                  },
                  {
                    key: "importo",
                    label: "Importo",
                    render: (p) => <strong>{formatEuro(p.importo_pagato)}</strong>,
                  },
                  {
                    key: "metodo",
                    label: "Metodo",
                    render: (p) => p.metodo_pagamento,
                  },
                  {
                    key: "estremi",
                    label: "Estremi",
                    render: (p) => p.estremi_pagamento,
                  },
                ]}
              />
            </Section>

            {/* Notifiche */}
            <Section
              icon={Bell}
              title="Notifiche"
              count={verbale.notifiche?.length}
              flush
            >
              <MiniTable
                empty="Non risultano notifiche."
                rows={verbale.notifiche}
                columns={[
                  {
                    key: "data",
                    label: "Data",
                    render: (n) => formatDate(n.data_notifica),
                  },
                  { key: "tipo", label: "Tipo", render: (n) => n.tipo_notifica },
                  {
                    key: "soggetto",
                    label: "Soggetto",
                    render: (n) => n.tipo_anagrafica,
                  },
                ]}
              />
            </Section>

            {/* Ricorsi */}
            <Section
              icon={Megaphone}
              title="Ricorsi"
              count={verbale.ricorsi?.length}
              flush
            >
              <MiniTable
                empty="Non risultano ricorsi."
                rows={verbale.ricorsi}
                columns={[
                  {
                    key: "data",
                    label: "Data",
                    render: (r) => formatDate(r.data_inserimento),
                  },
                  { key: "ente", label: "Ente", render: (r) => r.ente },
                  {
                    key: "soggetto",
                    label: "Soggetto",
                    render: (r) => r.soggetto_id,
                  },
                ]}
              />
            </Section>
          </SectionGrid>

          <FooterActions>
            <button type="button" className={btnCls()} onClick={goHome}>
              <HouseDoor />
              Cambia tipo di verbale
            </button>
            <button
              type="button"
              className={btnCls("primary")}
              onClick={nuovaRicerca}
            >
              Nuova ricerca
            </button>
          </FooterActions>
        </PageShell>
      )}
      <Footer />
    </div>
  );
};

export default Verbale;
