import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "../context/appContext";
import moment from "moment";
import dynamic from "next/dynamic";
import axios from "axios";
import fileDownload from "js-file-download";
import { useRouter } from "next/router";

const VerbaleAM = () => {
  const router = useRouter();

  const MyAlert = dynamic(() => import("../components/MyAlert"), {
    ssr: false,
  });

  const MyHeader = dynamic(() => import("../components/MyHeader"), {
    ssr: false,
  });

  const Footer = dynamic(() => import("../components/Footer"), { ssr: false });

  const MyButton = dynamic(() => import("../components/MyButton"), {
    ssr: false,
  });

  const MyCol = dynamic(() => import("../components/MyCol"), { ssr: false });

  const MyInput = dynamic(() => import("../components/MyInput"), {
    ssr: false,
  });

  const MyRow = dynamic(() => import("../components/MyRow"), { ssr: false });

  const MyTextArea = dynamic(() => import("../components/MyTextArea"), {
    ssr: false,
  });

  const MyPopover = dynamic(() => import("../components/MyPopover"), {
    ssr: false,
  });

  const getVerbale = async (codiceUnivoco) => {
    const response = await axios.get(
      `https://${localStorage.getItem(
        "subdomain"
      )}.api.openpolam.openpa.cloud/api/v1/verbali/public/${codiceUnivoco}`
    );
    // La risposta ha un array "data", prendiamo il primo elemento
    return response.data.data[0];
  };

  async function scaricaFile(e, documento) {
    e.preventDefault();
    const file = await getFileVerbale(
      documento.id,
      documento.title,
      codiceVerbale
    );
    console.log(file);
  }

  const { codiceVerbale } = useAppContext();

  const { amministrazione, setAmministrazione } = useState(undefined);
  const [verbale, setVerbale] = useState(undefined);
  const [documentiVerbale, setDocumentiVerbale] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (codiceVerbale != null && codiceVerbale != "") {
        try {
          const result = await getVerbale(codiceVerbale);
          console.log(result);
          setVerbale(result);

          // Prova a caricare i documenti (potrebbe non esistere l'endpoint)
          try {
            const documenti = await getDocumentiVerbale(codiceVerbale);
            console.log(documenti);
            setDocumentiVerbale(documenti);
          } catch (err) {
            console.log("Nessun documento disponibile");
            setDocumentiVerbale([]);
          }
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

  console.log(codiceVerbale);

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

  function openPagopaPagamenti(e) {
    e.preventDefault();
    window.open(`https://checkout.pagopa.it/`);
  }

  const [popoverOpen, setPopoverOpen] = useState(false);
  const togglePopover = () => {
    setPopoverOpen(!popoverOpen);
  };

  const targetRef = useRef(null);

  // Helper per formattare gli importi in centesimi
  const formatImporto = (importoCentesimi) => {
    if (!importoCentesimi && importoCentesimi !== 0) return "";
    return `€ ${(importoCentesimi / 100).toFixed(2).replace(".", ",")}`;
  };

  return (
    <div>
      <MyHeader />
      <div className="container">
        <div className="d-flex my-4 justify-content-between">
          <div>
            <h3 className="">Visualizzazione Verbale Ambiente</h3>
          </div>
        </div>

        <div className="d-flex my-4 justify-content-between">
          <div>
            <MyButton
              onClick={(e) => openPagopaPagamenti(e)}
              type="button"
              color="primary"
              title={"Paga con PagoPA"}
              disabled={false}
            ></MyButton>
          </div>
            
          <div>
            <MyButton
              onClick={(e) => openRichiestaRateizzazione(e)}
              type="button"
              color="success"
              title={"Richiedi rateizzazione"}
              disabled={
                verbale &&
                verbale.configurazione_stato &&
                ["RATEIZZATO", "ARCHIVIATO", "PAGATO"].includes(
                  verbale.configurazione_stato.descrizione
                )
              }
            ></MyButton>
          </div>

          <div>
            <MyButton
              onClick={(e) => openRichiestaAnnullamento(e)}
              type="button"
              color="danger"
              title={"Segnala anomalia"}
              disabled={
                verbale &&
                verbale.configurazione_stato &&
                ["RATEIZZATO", "ARCHIVIATO", "PAGATO"].includes(
                  verbale.configurazione_stato.descrizione
                )
              }
            ></MyButton>
          </div>
        </div>

        <div className="form-row" style={{ height: "100px" }}>
          <div className="col col-md-6">
            <h6 style={{ marginBottom: 15 }}>Numero Verbale</h6>
            <MyInput
              type="text"
              label="Numero Verbale"
              id="formNumeroVerbale"
              value={verbale ? `${verbale.n_serie}/${verbale.anno}` : ""}
            />
          </div>
          <div className="col col-md-6">
            <h6 style={{ marginBottom: 15 }}>Documentale</h6>
            {documentiVerbale.length > 0 ? (
              documentiVerbale.map((item) => (
                <MyButton
                  onClick={(e) => scaricaFile(e, item)}
                  type="submit"
                  color="primary"
                  title={`Scarica ${item.title}`}
                  disabled={false}
                ></MyButton>
              ))
            ) : (
              <MyInput
                type="text"
                id="nessunDocumento"
                value={"Nessun documento"}
              />
            )}
          </div>
        </div>

        <h6 style={{ marginBottom: 10 }}>Informazioni generali</h6>
        <div className="form-row" style={{ height: "80px" }}>
          <MyInput
            type="text"
            label="Stato"
            id="formStato"
            value={
              verbale && verbale.configurazione_stato
                ? verbale.configurazione_stato.descrizione
                : ""
            }
            wrapperClass="col col-md-6"
          />
        </div>

        <h6 style={{ marginBottom: 15 }}>Informazioni serie</h6>
        <div className="form-row" style={{ height: "100px" }}>
          <MyInput
            type="text"
            label="Numero"
            id="Numero"
            wrapperClass="col"
            value={verbale ? verbale.n_serie : ""}
          />
          <MyInput
            type="text"
            label="Serie"
            id="Serie"
            wrapperClass="col"
            value={verbale && verbale.serie ? verbale.serie.serie : ""}
          />
        </div>
        <div className="form-row" style={{ height: "90px" }}>
          <MyInput
            type="text"
            label="Denominazione"
            id="Denominazione"
            wrapperClass="col"
            value={verbale && verbale.serie ? verbale.serie.denominazione : ""}
          />
        </div>

        <h6 style={{ marginBottom: 15 }}>Informazioni luogo e data</h6>
        <div className="form-row" style={{ height: "90px" }}>
          <MyInput
            type="text"
            label="Data"
            id="Data"
            wrapperClass="col"
            value={
              verbale && verbale.data
                ? moment(verbale.data).format("DD/MM/YYYY")
                : ""
            }
          />
          <MyInput
            type="text"
            label="Ora"
            id="Ora"
            wrapperClass="col"
            value={
              verbale && verbale.ora ? moment(verbale.ora).format("HH:mm") : ""
            }
          />
          <MyInput
            type="text"
            label="Luogo"
            id="Luogo"
            wrapperClass="col"
            value={
              verbale && verbale.stradario_record
                ? `${verbale.stradario_record.tipo_strada} ${
                    verbale.stradario_record.descrizione
                  } ${verbale.civico || ""}`
                : ""
            }
          />
        </div>

        {verbale && verbale.tipo ? (
          <div className="form-row" style={{ height: "90px" }}>
            <MyInput
              type="text"
              label="Tipo"
              id="Tipo"
              wrapperClass="col"
              value={verbale.tipo}
            />
            {verbale.targa && (
              <MyInput
                type="text"
                label="Targa"
                id="Targa"
                wrapperClass="col"
                value={verbale.targa}
              />
            )}
          </div>
        ) : null}

        {verbale &&
        verbale.soggetto_trasgressore_records &&
        verbale.soggetto_trasgressore_records.length > 0 ? (
          verbale.soggetto_trasgressore_records.map((trasgressore, index) => (
            <div key={index}>
              <h6 style={{ marginBottom: 15 }}>Informazioni trasgressore</h6>
              <div className="form-row" style={{ height: "90px" }}>
                <MyInput
                  type="text"
                  label="Nome e cognome"
                  id={`Nome e cognome ${index}`}
                  wrapperClass="col"
                  value={
                    trasgressore.nome && trasgressore.cognome
                      ? `${trasgressore.nome} ${trasgressore.cognome}`
                      : trasgressore.ragione_sociale || ""
                  }
                />
                <MyInput
                  type="text"
                  label="Codice fiscale"
                  id={`Codice fiscale ${index}`}
                  wrapperClass="col"
                  value={trasgressore.codice_fiscale || ""}
                />
                <MyInput
                  type="text"
                  label="Data di nascita"
                  id={`Data di nascita ${index}`}
                  wrapperClass="col"
                  value={
                    trasgressore.data_nascita
                      ? moment(trasgressore.data_nascita).format("DD/MM/YYYY")
                      : ""
                  }
                />
              </div>
              <div className="form-row" style={{ height: "90px" }}>
                <MyInput
                  type="text"
                  label="Luogo di nascita"
                  id={`Luogo di nascita ${index}`}
                  wrapperClass="col"
                  value={
                    trasgressore.nascita_comune
                      ? `${trasgressore.nascita_comune} (${
                          trasgressore.nascita_provincia || ""
                        })`
                      : ""
                  }
                />
                <MyInput
                  type="text"
                  label="Residenza"
                  id={`Residenza ${index}`}
                  wrapperClass="col"
                  value={
                    trasgressore.residenza_toponimo
                      ? `${trasgressore.residenza_toponimo} ${
                          trasgressore.residenza_numero_civico || ""
                        }, ${trasgressore.residenza_comune || ""} (${
                          trasgressore.residenza_provincia || ""
                        })`
                      : ""
                  }
                />
                <MyInput
                  type="text"
                  label="Email"
                  id={`Email ${index}`}
                  wrapperClass="col"
                  value={trasgressore.email || trasgressore.pec || ""}
                />
              </div>
            </div>
          ))
        ) : (
          <MyAlert
            color="danger"
            title={"Nessuna informazione per il Trasgressore!"}
          ></MyAlert>
        )}

        {verbale &&
        verbale.obbligato_in_solido_records &&
        verbale.obbligato_in_solido_records.length > 0 ? (
          verbale.obbligato_in_solido_records.map((obbligato, index) => (
            <div key={index}>
              <h6 style={{ marginBottom: 15 }}>
                Informazioni obbligato in solido
              </h6>
              <div className="form-row" style={{ height: "90px" }}>
                <MyInput
                  type="text"
                  label="Nome e cognome"
                  id={`Nome e cognome obbligato ${index}`}
                  wrapperClass="col"
                  value={
                    obbligato.nome && obbligato.cognome
                      ? `${obbligato.nome} ${obbligato.cognome}`
                      : obbligato.ragione_sociale || ""
                  }
                />
                <MyInput
                  type="text"
                  label="Codice fiscale"
                  id={`Codice fiscale obbligato ${index}`}
                  wrapperClass="col"
                  value={obbligato.codice_fiscale || ""}
                />
                <MyInput
                  type="text"
                  label="Data di nascita"
                  id={`Data di nascita obbligato ${index}`}
                  wrapperClass="col"
                  value={
                    obbligato.data_nascita
                      ? moment(obbligato.data_nascita).format("DD/MM/YYYY")
                      : ""
                  }
                />
              </div>
            </div>
          ))
        ) : (
          <MyAlert
            color="warning"
            title={"Nessun obbligato in solido presente."}
          ></MyAlert>
        )}

        {verbale &&
          verbale.violazioni_records &&
          verbale.violazioni_records.map((item, index) => (
            <div key={index}>
              <h6 style={{ marginBottom: 15 }}>
                Informazioni violazione {index + 1}
              </h6>
              <MyRow>
                <MyCol>
                  <MyTextArea
                    rows={3}
                    label="Descrizione"
                    placeholder="Descrizione"
                    value={item.descrizione}
                  />
                </MyCol>
                <MyCol>
                  <MyInput
                    type="text"
                    label="Articolo"
                    id={`Articolo ${index}`}
                    wrapperClass="col"
                    value={`Art. ${item.articolo}${
                      item.comma ? `, comma ${item.comma}` : ""
                    }`}
                  />
                  <MyInput
                    type="text"
                    label="Imp. Ridotto"
                    id={`Imp. Ridotto ${index}`}
                    wrapperClass="col"
                    value={`€ ${item.importo_ridotto}`}
                  />
                  <MyInput
                    type="text"
                    label="Tipologia"
                    id={`Tipologia ${index}`}
                    wrapperClass="col"
                    value={
                      item.configurazione_tipologia_violazione
                        ? item.configurazione_tipologia_violazione.descrizione
                        : ""
                    }
                  />
                </MyCol>
              </MyRow>
              <div className="form-row" style={{ height: "100px" }}>
                <MyInput
                  type="text"
                  label="Norma violata"
                  id={`Norma violata ${index}`}
                  wrapperClass="col"
                  value={item.riferimento_norma_violata || ""}
                />
                <MyInput
                  type="text"
                  label="Materia"
                  id={`Materia ${index}`}
                  wrapperClass="col"
                  value={
                    item.configurazione_materia
                      ? item.configurazione_materia.descrizione
                      : ""
                  }
                />
              </div>
            </div>
          ))}

        <h6 style={{ marginBottom: 15 }}>Riepilogo importi</h6>
        <div className="form-row" style={{ height: "100px" }}>
          <MyInput
            type="text"
            label="Importo sanzione"
            id="Importo sanzione"
            wrapperClass="col"
            value={
              verbale
                ? formatImporto(verbale.importo_sanzione_totale_entro_i_termini)
                : ""
            }
          />
          <MyInput
            type="text"
            label="Spese notifica"
            id="Spese notifica"
            wrapperClass="col"
            value={verbale ? formatImporto(verbale.spese_di_notifica) : ""}
          />
          <MyInput
            type="text"
            label="Spese procedura"
            id="Spese procedura"
            wrapperClass="col"
            value={verbale ? formatImporto(verbale.spese_di_procedura) : ""}
          />
          <MyInput
            type="text"
            label="Importo totale"
            id="Importo totale"
            wrapperClass="col"
            value={verbale ? formatImporto(verbale.importo_totale) : ""}
          />
        </div>

        {verbale &&
        verbale.agenti_records &&
        verbale.agenti_records.length > 0 ? (
          <div>
            <h6 style={{ marginBottom: 15 }}>Agenti accertatori</h6>
            {verbale.agenti_records.map((agente, index) => (
              <div className="form-row" style={{ height: "100px" }} key={index}>
                <MyInput
                  type="text"
                  label="Nome e cognome"
                  id={`Agente ${index}`}
                  wrapperClass="col"
                  value={`${agente.nome} ${agente.cognome}`}
                />
                <MyInput
                  type="text"
                  label="Matricola"
                  id={`Matricola ${index}`}
                  wrapperClass="col"
                  value={agente.matricola || ""}
                />
                <MyInput
                  type="text"
                  label="Qualifica"
                  id={`Qualifica ${index}`}
                  wrapperClass="col"
                  value={agente.qualifica || ""}
                />
              </div>
            ))}
          </div>
        ) : (
          <MyAlert
            color="danger"
            title={"Nessuna informazione per gli Agenti!"}
          ></MyAlert>
        )}

        {verbale &&
        verbale.testimoni_records &&
        verbale.testimoni_records.length > 0 ? (
          <div>
            <h6 style={{ marginBottom: 15 }}>Testimoni</h6>
            {verbale.testimoni_records.map((testimone, index) => (
              <div className="form-row" style={{ height: "100px" }} key={index}>
                <MyInput
                  type="text"
                  label="Nome e cognome"
                  id={`Testimone ${index}`}
                  wrapperClass="col"
                  value={`${testimone.nome} ${testimone.cognome}`}
                />
                <MyInput
                  type="text"
                  label="Codice fiscale"
                  id={`CF Testimone ${index}`}
                  wrapperClass="col"
                  value={testimone.codice_fiscale || ""}
                />
              </div>
            ))}
          </div>
        ) : (
          <MyAlert
            color="warning"
            title={"Nessun testimone presente."}
          ></MyAlert>
        )}

        {verbale && verbale.dichiarazione_trasgressore ? (
          <div>
            <h6 style={{ marginBottom: 15 }}>Dichiarazione trasgressore</h6>
            <div className="form-row" style={{ height: "120px" }}>
              <MyTextArea
                rows={3}
                label="Dichiarazione"
                placeholder="Dichiarazione"
                value={verbale.dichiarazione_trasgressore}
              />
            </div>
          </div>
        ) : null}
      </div>
      <Footer />
    </div>
  );
};

export default VerbaleAM;
