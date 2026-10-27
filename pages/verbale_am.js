import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/router";
import {
  CashCoin,
  CreditCard,
  ExclamationTriangle,
  Eye,
  GeoAlt,
  HouseDoor,
  Journal,
  People,
  ShieldCheck,
} from "react-bootstrap-icons";
import PagoPaButton from "../components/PagoPaButton";
import { apriCarrelloPagoPA, avvisoPagabileAm } from "../utils/pagopa";
import {
  ActionBar,
  BackLink,
  btnCls,
  DetailHero,
  EmptyNote,
  FooterActions,
  InfoGrid,
  MiniTable,
  PageShell,
  Plate,
  Section,
  SectionGrid,
  StatusBadge,
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

// Gli importi del verbale AM arrivano in centesimi
const formatCents = (value) =>
  value === null || value === undefined || value === ""
    ? ""
    : formatEuro(Number(value) / 100);

const soggettoItems = (s) => [
  {
    label: "Nome e cognome",
    value: s.nome && s.cognome ? `${s.nome} ${s.cognome}` : s.ragione_sociale,
  },
  { label: "Codice fiscale", value: s.codice_fiscale, mono: true },
  { label: "Data di nascita", value: formatDate(s.data_nascita) },
];

const VerbaleAM = () => {
  const router = useRouter();

  const getVerbale = async (codiceUnivoco) => {
    const response = await axios.get(
      `https://${localStorage.getItem(
        "subdomain"
      )}.api.openpolam.openpa.cloud/api/v1/verbali/public/${codiceUnivoco}`
    );
    // La risposta ha un array "data", prendiamo il primo elemento
    const result = response.data.data[0];
    return result && { ...result, configurazione_comune: response.data.configurazione_comune };
  };

  const { codiceVerbale } = useAppContext();

  const [verbale, setVerbale] = useState(undefined);
  const [pagamentoInCorso, setPagamentoInCorso] = useState(false);
  const [errorePagamento, setErrorePagamento] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (codiceVerbale != null && codiceVerbale != "") {
        try {
          const result = await getVerbale(codiceVerbale);
          if (!result) throw new Error("Verbale non trovato");
          setVerbale(result);
        } catch (error) {
          console.error("Errore nel caricamento del verbale:", error);
          router.push("/login_am");
        }
      } else {
        router.push("/login_am");
      }
    }
    fetchData();
  }, []);

  async function openPagopaPagamenti(e) {
    e.preventDefault();
    setErrorePagamento("");
    setPagamentoInCorso(true);
    const comune = verbale.configurazione_comune;
    console.info("[pagoPA] dati pagamento verbale AM", {
      codice_fiscale_ente: comune?.codice_fiscale,
      importo_totale: verbale.importo_totale,
      pagamenti: (verbale.pagamenti || []).map((p) => ({
        metodo: p.metodo_pagamento,
        data_pagamento: p.data_pagamento,
        iuv: p.iuv,
        qrcode: p.qrcode_string_pagopa,
        scadenza: p.data_scadenza_pagopa,
      })),
    });
    try {
      await apriCarrelloPagoPA(avvisoPagabileAm(verbale, comune?.codice_fiscale), {
        companyName: comune?.comune ? `Comune di ${comune.comune}` : "Comune",
        description: `Verbale ${verbale.n_serie || ""}${
          verbale.anno ? `/${verbale.anno}` : ""
        }`.trim(),
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

  function goHome() {
    router.push("/");
  }

  function nuovaRicerca() {
    router.push("/login_am");
  }

  // Normalizzazioni per compatibilità con l'API
  const trasgressori = verbale?.soggetto_trasgressore_records || [];
  const obbligati = verbale?.obbligato_in_solido_records || [];
  const violazioni = verbale?.violazioni_records || [];
  const agenti = verbale?.agenti_records || [];
  const testimoni = verbale?.testimoni_records || [];
  const pagamenti = verbale?.pagamenti || [];

  const statoVerbale = verbale?.configurazione_stato?.descrizione || "";
  const isVerbalePagato = statoVerbale.toUpperCase().includes("PAGATO");

  const luogo = verbale?.stradario_record
    ? `${verbale.stradario_record.tipo_strada || ""} ${
        verbale.stradario_record.descrizione || ""
      } ${verbale.civico || ""}`.trim()
    : "";

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
            eyebrow="Verbale Amministrativo"
            title={
              verbale.n_serie
                ? `Verbale n. ${verbale.n_serie}${
                    verbale.anno ? `/${verbale.anno}` : ""
                  }`
                : "Dettaglio verbale"
            }
            subtitle={
              [
                verbale.serie?.serie ? `Serie ${verbale.serie.serie}` : "",
                verbale.serie?.denominazione,
              ]
                .filter(Boolean)
                .join(" · ")
            }
            status={statoVerbale}
            stats={[
              { label: "Data", value: formatDate(verbale.data) },
              { label: "Ora", value: formatDate(verbale.ora, "HH:mm") },
              { label: "Targa", value: verbale.targa },
              {
                label: "Importo totale",
                value: formatCents(verbale.importo_totale),
              },
            ]}
          />

          {/* Pulsanti azioni */}
          <ActionBar>
            {isVerbalePagato ? (
              <button className={btnCls("primary")} disabled>
                <CreditCard /> Verbale pagato
              </button>
            ) : (
              <PagoPaButton
                small
                onClick={openPagopaPagamenti}
                loading={pagamentoInCorso}
              />
            )}
          </ActionBar>

          {errorePagamento ? (
            <div className="alert alert-danger" role="alert">
              {errorePagamento}
            </div>
          ) : null}

          <SectionGrid>
            {/* Violazioni */}
            <Section
              icon={ExclamationTriangle}
              title="Violazioni contestate"
              count={violazioni.length}
              full
            >
              {violazioni.length > 0 ? (
                violazioni.map((item, index) => (
                  <Violation
                    key={index}
                    index={index + 1}
                    description={item.descrizione}
                    chips={[
                      {
                        label: "Articolo",
                        value: item.articolo
                          ? `Art. ${item.articolo}${
                              item.comma ? `, comma ${item.comma}` : ""
                            }`
                          : "",
                      },
                      {
                        label: "Imp. ridotto",
                        value: formatEuro(item.importo_ridotto),
                      },
                      {
                        label: "Tipologia",
                        value:
                          item.configurazione_tipologia_violazione?.descrizione,
                      },
                      {
                        label: "Norma",
                        value: item.riferimento_norma_violata,
                      },
                      {
                        label: "Materia",
                        value: item.configurazione_materia?.descrizione,
                      },
                    ]}
                  />
                ))
              ) : (
                <EmptyNote>Nessuna violazione presente.</EmptyNote>
              )}
            </Section>

            {/* Riepilogo importi */}
            <Section icon={CashCoin} title="Riepilogo importi" full>
              <Totals
                tiles={[
                  {
                    label: "Importo sanzione",
                    value: formatCents(
                      verbale.importo_sanzione_totale_entro_i_termini
                    ),
                  },
                  {
                    label: "Spese notifica",
                    value: formatCents(verbale.spese_di_notifica),
                  },
                  {
                    label: "Spese procedura",
                    value: formatCents(verbale.spese_di_procedura),
                  },
                  {
                    label: "Importo totale",
                    value: formatCents(verbale.importo_totale),
                    accent: true,
                  },
                ]}
              />
            </Section>

            {/* Luogo e circostanze */}
            <Section icon={GeoAlt} title="Luogo e circostanze">
              <InfoGrid
                items={[
                  { label: "Data", value: formatDate(verbale.data) },
                  { label: "Ora", value: formatDate(verbale.ora, "HH:mm") },
                  { label: "Luogo", value: luogo, full: true },
                  { label: "Tipo", value: verbale.tipo },
                  {
                    label: "Targa",
                    value: verbale.targa ? <Plate value={verbale.targa} /> : "",
                  },
                ]}
              />
            </Section>

            {/* Dati verbale */}
            <Section icon={Journal} title="Dati verbale">
              <InfoGrid
                items={[
                  {
                    label: "Numero verbale",
                    value: verbale.n_serie
                      ? `${verbale.n_serie}${
                          verbale.anno ? `/${verbale.anno}` : ""
                        }`
                      : "",
                  },
                  { label: "Serie", value: verbale.serie?.serie },
                  {
                    label: "Denominazione",
                    value: verbale.serie?.denominazione,
                    full: true,
                  },
                  {
                    label: "Stato",
                    value: statoVerbale ? (
                      <StatusBadge label={statoVerbale} />
                    ) : (
                      ""
                    ),
                  },
                ]}
              />
            </Section>

            {/* Soggetti */}
            <Section icon={People} title="Soggetti" full>
              {trasgressori.length > 0 ? (
                trasgressori.map((t, index) => (
                  <SubBlock
                    key={`t-${index}`}
                    title={
                      trasgressori.length > 1
                        ? `Trasgressore ${index + 1}`
                        : "Trasgressore"
                    }
                  >
                    <InfoGrid
                      items={[
                        ...soggettoItems(t),
                        {
                          label: "Luogo di nascita",
                          value: t.nascita_comune
                            ? `${t.nascita_comune}${
                                t.nascita_provincia
                                  ? ` (${t.nascita_provincia})`
                                  : ""
                              }`
                            : "",
                        },
                        {
                          label: "Residenza",
                          value: t.residenza_toponimo
                            ? `${t.residenza_toponimo} ${
                                t.residenza_numero_civico || ""
                              }, ${t.residenza_comune || ""}${
                                t.residenza_provincia
                                  ? ` (${t.residenza_provincia})`
                                  : ""
                              }`
                            : "",
                        },
                        { label: "Email", value: t.email || t.pec },
                      ]}
                    />
                  </SubBlock>
                ))
              ) : (
                <SubBlock title="Trasgressore">
                  <EmptyNote>
                    Nessuna informazione per il trasgressore.
                  </EmptyNote>
                </SubBlock>
              )}

              {obbligati.length > 0 ? (
                obbligati.map((o, index) => (
                  <SubBlock
                    key={`o-${index}`}
                    title={
                      obbligati.length > 1
                        ? `Obbligato in solido ${index + 1}`
                        : "Obbligato in solido"
                    }
                  >
                    <InfoGrid items={soggettoItems(o)} />
                  </SubBlock>
                ))
              ) : (
                <SubBlock title="Obbligato in solido">
                  <EmptyNote>Nessun obbligato in solido presente.</EmptyNote>
                </SubBlock>
              )}

              {verbale.dichiarazione_trasgressore ? (
                <SubBlock title="Dichiarazione del trasgressore">
                  <p className="mb-0" style={{ whiteSpace: "pre-line" }}>
                    {verbale.dichiarazione_trasgressore}
                  </p>
                </SubBlock>
              ) : null}
            </Section>

            {/* Agenti */}
            <Section
              icon={ShieldCheck}
              title="Agenti accertatori"
              count={agenti.length}
              flush
            >
              <MiniTable
                empty="Nessuna informazione per gli agenti."
                rows={agenti}
                columns={[
                  {
                    key: "nome",
                    label: "Nome e cognome",
                    render: (a) =>
                      [a.nome, a.cognome].filter(Boolean).join(" "),
                  },
                  {
                    key: "matricola",
                    label: "Matricola",
                    render: (a) => a.matricola,
                  },
                  {
                    key: "qualifica",
                    label: "Qualifica",
                    render: (a) => a.qualifica,
                  },
                ]}
              />
            </Section>

            {/* Testimoni */}
            <Section
              icon={Eye}
              title="Testimoni"
              count={testimoni.length}
              flush
            >
              <MiniTable
                empty="Nessun testimone presente."
                rows={testimoni}
                columns={[
                  {
                    key: "nome",
                    label: "Nome e cognome",
                    render: (t) =>
                      [t.nome, t.cognome].filter(Boolean).join(" "),
                  },
                  {
                    key: "cf",
                    label: "Codice fiscale",
                    render: (t) => t.codice_fiscale,
                  },
                ]}
              />
            </Section>

            {/* Pagamenti */}
            {pagamenti.length > 0 ? (
              <Section
                icon={CreditCard}
                title="Pagamenti"
                count={pagamenti.length}
                full
                flush
              >
                <MiniTable
                  rows={pagamenti}
                  columns={[
                    {
                      key: "data",
                      label: "Data",
                      render: (p) => formatDate(p.data_pagamento),
                    },
                    {
                      key: "importo",
                      label: "Importo",
                      render: (p) => (
                        <strong>{formatEuro(p.importo_pagato)}</strong>
                      ),
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
            ) : null}
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

export default VerbaleAM;
