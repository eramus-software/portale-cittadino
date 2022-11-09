import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
/*import {
  getVerbale,
  getDocumentiVerbale,
  getFileVerbale,
} from "../services/verbali";*/
import moment from "moment";
import dynamic from "next/dynamic";
import axios from "axios";
import { baseUrl } from "../utils/config";
import fileDownload from "js-file-download";
//import {Alert, Button, Col, Input, Row, TextArea} from 'design-react-kit'

const Verbale = () => {

  const MyAlert = dynamic(() => import("../components/MyAlert"),
  { ssr: false });

  const MyHeader = dynamic(() => import("../components/MyHeader"),
  { ssr: false });

  const Footer = dynamic(() => import("../components/Footer"),
  { ssr: false });

  const MyButton = dynamic(() => import("../components/MyButton"),
  { ssr: false });

  const MyCol = dynamic(() => import("../components/MyCol"),
  { ssr: false });

  const MyInput = dynamic(() => import("../components/MyInput"),
  { ssr: false });

  const MyRow = dynamic(() => import("../components/MyRow"),
  { ssr: false });

  const MyTextArea = dynamic(() => import("../components/MyTextArea"),
  { ssr: false });

  /*const Alert = dynamic(() => import('design-react-kit').then((module) => module.Alert), {
    ssr: false,
  });
  const Button = dynamic(
    () => import("design-react-kit").then((module) => module.Button),
    {
      ssr: false,
    }
  );
  const Col = dynamic(
    () => import("design-react-kit").then((module) => module.Col),
    {
      ssr: false,
    }
  );
  const Input = dynamic(
    () => import("design-react-kit").then((module) => module.Input),
    {
      ssr: false,
    }
  );
  const Row = dynamic(
    () => import("design-react-kit").then((module) => module.Row),
    {
      ssr: false,
    }
  );
  const TextArea = dynamic(
    () => import("design-react-kit").then((module) => module.TextArea),
    {
      ssr: false,
    }
  );*/

  const getVerbale = async (id) => {
    const response = await axios.get(
      baseUrl() + `/verbali/${id}`,
      {
        headers: {
          "X-Api-Key": s, //the token is a variable which holds the token
        },
      }
    );
    return response.data;
  };

  const getDocumentiVerbale = async (id) => {
    const response = await axios.get(
      baseUrl() +
        `/verbali/${id}/documents`,
      {
        headers: {
          "X-Api-Key": s, //the token is a variable which holds the token
        },
      }
    );
    return response.data;
  };

  const getFileVerbale = async (id, name, codice) => {
    // const writer = createWriteStream("download");
    const response = await axios.get(
      baseUrl() +
        `/documents/${id}?codiceunivoco=${codice}`,
      {
        headers: {
          "X-Api-Key": s, //the token is a variable which holds the token
        },
        responseType: "blob",
      }
    );
    fileDownload(response.data, name);
  
    // return response.data.pipe(writer);
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

  const { codiceVerbale, s } = useAppContext();

  const { amministrazione, setAmministrazione } = useState(undefined);
  const [verbale, setVerbale] = useState(undefined);
  const [documentiVerbale, setDocumentiVerbale] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getVerbale(codiceVerbale);
      console.log(result);
      const documenti = await getDocumentiVerbale(codiceVerbale);
      console.log(documenti);
      setVerbale(result);
      setDocumentiVerbale(documenti);
    }
    fetchData();
  }, []);

  console.log(codiceVerbale);

  return (
    <div>
      <MyHeader />
      <div className="container">
        <h3 className="my-4">Visualizzazione Verbale</h3>

        <div className="form-row">
          <div className="col col-md-6">
            <h6 style={{ marginBottom: 20 }}>Protocollo</h6>
            <MyInput
              type="text"
              label="Protocollo"
              id="formProtocollo"
              value={verbale ? verbale.protocollo : ""}
              
            />
          </div>
          <div className="col col-md-6">
            <h6 style={{ marginBottom: 20 }}>Documentale</h6>
            {documentiVerbale.length > 0 ? (
              documentiVerbale.map((item) => (
                <MyButton
                  onClick={(e) => scaricaFile(e, item)}
                  type="submit"
                  color="primary"
                  title={`Scarica ${item.title}`}
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
        <h6 style={{ marginBottom: 20 }}>Informazioni zona</h6>
        <div className="form-row">
          <MyInput
            type="text"
            label="Amministrazione verbale"
            id="formAmministrazione verbale"
            value={amministrazione}
            wrapperClass="col col-md-6"
            
          />
        </div>
        <h6 style={{ marginBottom: 20 }}>Informazioni blocchettario</h6>
        <div className="form-row">
          <MyInput
            type="text"
            label="Numero"
            id="Numero"
            wrapperClass="col"
            value={verbale ? verbale.numeroserie : ""}
            
          />
          <MyInput
            type="text"
            label="Serie"
            id="Serie"
            wrapperClass="col"
            value={verbale ? verbale.blocchettario.serie : ""}
            
          />
        </div>
        <div className="form-row">
          <MyInput
            type="text"
            label="Descrizione"
            id="Descrizione"
            wrapperClass="col"
            value={verbale ? verbale.blocchettario.descrizione : ""}
            
          />
        </div>
        <h6 style={{ marginBottom: 20 }}>Informazioni veicolo</h6>
        <div className="form-row">
          <MyInput
            type="text"
            label="Targa"
            id="Targa"
            wrapperClass="col"
            value={verbale ? verbale.targaveicolo : ""}
            
          />
          <MyInput
            type="text"
            label="Tipo targa"
            id="Tipo targa"
            wrapperClass="col"
            value={verbale ? verbale.tipotarga : ""}
            
          />
          <MyInput
            type="text"
            label="Tipo veicolo"
            id="Tipo veicolo"
            wrapperClass="col"
            value={verbale ? verbale.tipoveicolo : ""}
            
          />
        </div>
        {verbale && verbale.proprietario ? (
          <div>
            <h6 style={{ marginBottom: 20 }}>Informazioni proprietario</h6>
            <div className="form-row">
              <MyInput
                type="text"
                label="Nome e cognome"
                id="Nome e cognome"
                wrapperClass="col"
                value={
                  verbale && verbale.proprietario
                    ? `${verbale.proprietario.nome} ${verbale.proprietario.cognome}`
                    : ""
                }
                
              />
              <MyInput
                type="text"
                label="Codice fiscale"
                id="Codice fiscale"
                wrapperClass="col"
                value={
                  verbale && verbale.proprietario
                    ? verbale.proprietario.codfiscale
                    : ""
                }
                
              />
              <MyInput
                type="text"
                label="Data di nascita"
                id="Data di nascita"
                wrapperClass="col"
                value={
                  verbale && verbale.proprietario
                    ? verbale.proprietario.data_nascita.replace(/-/g,"/").split("/").reverse().join("/")
                    : ""
                }
                
              />
            </div>{" "}
          </div>
        ) : (
          <MyAlert
            color="danger"
            title={"Nessuna informazione per il Proprietario!"}
          ></MyAlert>
        )}

        {verbale && verbale.tutore ? (
          <div>
            <h6 style={{ marginBottom: 20 }}>Informazioni tutore</h6>
            <div className="form-row">
              <MyInput
                type="text"
                label="Nome e cognome"
                id="Nome e cognome"
                wrapperClass="col"
                value={
                  verbale && verbale.tutore
                    ? `${verbale.tutore.nome} ${verbale.tutore.cognome}`
                    : ""
                }
                
              />
              <MyInput
                type="text"
                label="Codice fiscale"
                id="Codice fiscale"
                wrapperClass="col"
                value={
                  verbale && verbale.tutore ? verbale.tutore.codfiscale : ""
                }
                
              />
              <MyInput
                type="text"
                label="Data di nascita"
                id="Data di nascita"
                wrapperClass="col"
                value={
                  verbale && verbale.tutore ? verbale.tutore.data_nascita.replace(/-/g,"/").split("/").reverse().join("/"): ""
                }
                
              />
            </div>{" "}
          </div>
        ) : (
          <MyAlert
            color="danger"
            title={" Nessuna informazione per il Tutore!"}
          ></MyAlert>
        )}

        {verbale && verbale.trasgressore ? (
          <div>
            <h6 style={{ marginBottom: 20 }}>Informazioni trasgressore</h6>
            <div className="form-row">
              <MyInput
                type="text"
                label="Nome e cognome"
                id="Nome e cognome"
                wrapperClass="col"
                value={
                  verbale && verbale.trasgressore
                    ? `${verbale.trasgressore.nome} ${verbale.trasgressore.cognome}`
                    : ""
                }
                
              />
              <MyInput
                type="text"
                label="Codice fiscale"
                id="Codice fiscale"
                wrapperClass="col"
                value={
                  verbale && verbale.trasgressore
                    ? verbale.trasgressore.codfiscale
                    : ""
                }
                
              />
              <MyInput
                type="text"
                label="Data di nascita"
                id="Data di nascita"
                wrapperClass="col"
                value={
                  verbale && verbale.trasgressore
                    ? verbale.trasgressore.data_nascita.replace(/-/g,"/").split("/").reverse().join("/")
                    : ""
                }
                
              />
            </div>{" "}
          </div>
        ) : (
          <MyAlert
            color="danger"
            title={"Nessuna informazione per il Trasgressore!"}
          ></MyAlert>
        )}
        {verbale &&
          verbale.violazioni.map((item) => (
            <div>
              <h6 style={{ marginBottom: 20 }}>Informazioni violazioni</h6>
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
                    label="Imp. Ridotto"
                    id="Imp. Ridotto"
                    wrapperClass="col"
                    value={`€ ${item.importoridotto}`}
                    
                  />
                  <MyInput
                    type="text"
                    label="Imp. Ruoli"
                    id="Imp. Ruoli"
                    wrapperClass="col"
                    value={`€ ${item.importoruolo}`}
                    
                  />
                  <MyInput
                    type="text"
                    label="Punti"
                    id="Punti"
                    wrapperClass="col"
                    value={item.punti || "no punti"}
                    
                  />
                </MyCol>
              </MyRow>
              <div className="form-row">
                <MyInput
                  type="text"
                  label="Tot. Imp. Ruolo"
                  id="Tot. Imp. Ruolo"
                  wrapperClass="col"
                  value={`€ ${verbale
                      ? verbale.violazioni
                          .filter((item) => item.importoruolo)
                          .reduce(
                            (partialSum, a) => partialSum + a.importoruolo,
                            0
                          ).toFixed(2).replace(".",",")
                      : ""}`
                  }
                  
                />
                <MyInput
                  type="text"
                  label="Tot. Imp. Ridotto"
                  id="Tot. Imp. Ridotto"
                  wrapperClass="col"
                  value={`€ ${
                    verbale
                      ? verbale.violazioni
                          .filter((item) => item.importoridotto)
                          .reduce(
                            (partialSum, a) => partialSum + a.importoridotto,
                            0
                          ).toFixed(2).replace(".",",")
                      : ""
                  }`}
                  
                />
              </div>
            </div>
          ))}
        <h6 style={{ marginBottom: 20 }}>Comunicazioni dati conducente</h6>
        <div className="form-row">
          <MyInput
            type="text"
            label="Data Presentazione Documenti"
            id="Data Presentazione Documenti"
            wrapperClass="col"
            value={
              verbale ? moment(verbale.data_presentazione_documenti).format("DD-MM-YYYY").replace(/-/g,"/") || "no data" : ""
            }
            
          />
        </div>
        {verbale && verbale.pagamenti && verbale.pagamenti.length > 0 ? (
          verbale.pagamenti.map((item) => (
            <div>
              <h6 style={{ marginBottom: 20 }}>Pagamento</h6>
              <div className="form-row">
                <MyInput
                  type="text"
                  label="Data Pagamento"
                  id="Data Pagamento"
                  wrapperClass="col"
                  value={
                    moment(item.data_pagamento).format("DD-MM-YYYY").replace(/-/g,"/") ||
                    "no data"
                  }
                  
                />
                <MyInput
                  type="text"
                  label="Importo Pagato"
                  id="Importo Pagato"
                  wrapperClass="col"
                  value={`€ ${item.importo_pagato.toFixed(2).replace(".",",") || "no data"}`}
                  
                />
                <MyInput
                  type="text"
                  label="Metodo di Pagamento"
                  id="Metodo di Pagamento"
                  wrapperClass="col"
                  value={item.metodo_pagamento || "no data"}
                  
                />
                <MyInput
                  type="text"
                  label="Estremi Pagamento"
                  id="Estremi Pagamento"
                  wrapperClass="col"
                  value={item.estremi_pagamento || ""}
                  
                />
              </div>
            </div>
          ))
        ) : (
          <MyAlert color="danger" title={"Non esistono Pagamenti!"}></MyAlert>
        )}

        {verbale && verbale.notifiche && verbale.notifiche.length > 0 ? (
          <div>
            {verbale.notifiche.map((item) => (
              <div>
                <h6 style={{ marginBottom: 20 }}>Notifica</h6>
                <div className="form-row">
                  <MyInput
                    type="text"
                    label="Data Notifica"
                    id="Data Notifica"
                    wrapperClass="col"
                    value={
                      moment(item.data_notifica).format("DD-MM-YYYY").replace(/-/g,"/") ||
                      "no data"
                    }
                    
                  />
                  <MyInput
                    type="text"
                    label="Tipo"
                    id="Tipo"
                    wrapperClass="col"
                    value={item.tipo_notifica || "no data"}
                    
                  />
                  <MyInput
                    type="text"
                    label="Soggetto"
                    id="Soggetto"
                    wrapperClass="col"
                    value={item.tipo_anagrafica || "no data"}
                    
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <MyAlert color="danger" title={"Non esistono Notifiche!"}></MyAlert>
        )}

        {verbale && verbale.ricorsi && verbale.ricorsi.length > 0 ? (
          <div>
            {verbale.ricorsi.map((item) => (
              <div>
                <h6 style={{ marginBottom: 20 }}>Ricorso</h6>
                <div className="form-row">
                  <MyInput
                    type="text"
                    label="Data Ricorso"
                    id="Data Ricorso"
                    wrapperClass="col"
                    value={ item.data_inserimento ?
                      moment(item.data_inserimento).format("DD-MM-YYYY").replace(/-/g,"/") :
                      ""
                    }
                    
                  />
                  <MyInput
                    type="text"
                    label="Ente"
                    id="Ente"
                    wrapperClass="col"
                    value={item.ente || ""}
                    
                  />
                  <MyInput
                    type="text"
                    label="Soggetto"
                    id="Soggetto"
                    wrapperClass="col"
                    value={item.soggetto_id || ""}
                    
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <MyAlert color="danger" title={"Non esistono Ricorsi!"}></MyAlert>
        )}

        <h6 style={{ marginBottom: 20 }}>
          Ricorso-immatricolazione-revisione-assicurazione
        </h6>
        <div className="form-row">
          <MyInput
            type="text"
            label="Data Immatricolazione"
            id="Data Immatricolazione"
            wrapperClass="col"
            value={
              verbale.dataimmatricolazione
                ? moment(verbale.dataimmatricolazione).format("DD-MM-YYYY").replace(/-/g,"/")
                : ""
            }
            
          />
          <MyInput
            type="text"
            label="Data Scadenza Revisione"
            id="Data Scadenza Revisione"
            wrapperClass="col"
            value={
              verbale.datarevisione
                ? moment(verbale.datarevisione).format("DD-MM-YYYY").replace(/-/g,"/")
                : ""
            }
            
          />
          <MyInput
            type="text"
            label="Data Scadenza Assicurazione"
            id="Data Scadenza Assicurazione"
            wrapperClass="col"
            value={
              verbale.dataassicurazione
                ? moment(verbale.dataassicurazione).format("DD-MM-YYYY").replace(/-/g,"/")
                : ""
            }
            
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Verbale;
