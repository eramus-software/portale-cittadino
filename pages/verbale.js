import React, { useEffect, useState } from "react";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "typeface-titillium-web";
import "typeface-roboto-mono";
import "typeface-lora";
import { useAppContext } from "../context/appContext";
import { getVerbale, getDocumentiVerbale, getFileVerbale } from "../services/verbali";
import moment from 'moment'
import MyHeader from "../components/MyHeader";
import Footer from "../components/Footer";
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic';

const Verbale = () => {
  const pathname = window.location.pathname;
  const router = useRouter()

  const Alert = dynamic(() => import('design-react-kit').then((module) => module.Alert), {
    ssr: false,
  });
  const Button = dynamic(() => import('design-react-kit').then((module) => module.Button), {
    ssr: false,
  });
  const Col = dynamic(() => import('design-react-kit').then((module) => module.Col), {
    ssr: false,
  });
  const Input = dynamic(() => import('design-react-kit').then((module) => module.Input), {
    ssr: false,
  });
  const Row = dynamic(() => import('design-react-kit').then((module) => module.Row), {
    ssr: false,
  });
  const TextArea = dynamic(() => import('design-react-kit').then((module) => module.TextArea), {
    ssr: false,
  });

  async function scaricaFile (e, documento) {
    e.preventDefault()
    const file = await getFileVerbale(documento.id, documento.title, codiceVerbale)
    console.log(file)
  }

  const { codiceVerbale } = useAppContext();

  const { amministrazione, setAmministrazione } = useState(undefined);
  const [verbale, setVerbale] = useState(undefined);
  const [documentiVerbale, setDocumentiVerbale] = useState([])

  useEffect(() => {

    async function fetchData() {
      const result = await getVerbale(codiceVerbale);
      console.log(result);
      const documenti = await getDocumentiVerbale(codiceVerbale)
      console.log(documenti)
      setVerbale(result);
      setDocumentiVerbale(documenti)
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
        <Input
          type="text"
          label="Protocollo"
          id="formProtocollo"
          value={verbale ? verbale.protocollo : ""}
          readOnly
        />
        </div>
        <div className="col col-md-6">
          <h6 style={{ marginBottom: 20 }}>Documentale</h6>
          {documentiVerbale.length > 0 ? documentiVerbale.map((item) => (
            <Button onClick={(e) => scaricaFile(e, item)} type="submit" color="primary">
            Scarica {item.title}
          </Button>
          )) : <Input
          type="text"
          id="nessunDocumento"
          value={"Nessun documento"}
          readOnly
          disabled
        /> }
        </div>

      </div>
      <h6 style={{ marginBottom: 20 }}>Informazioni zona</h6>
      <div className="form-row">
        <Input
          type="text"
          label="Amministrazione verbale"
          id="formAmministrazione verbale"
          value={amministrazione}
          wrapperClass="col col-md-6"
          readOnly
        />
      </div>
      <h6 style={{ marginBottom: 20 }}>Informazioni blocchettario</h6>
      <div className="form-row">
        <Input
          type="text"
          label="Numero"
          id="Numero"
          wrapperClass="col"
          value={verbale ? verbale.numeroserie : ""}
          readOnly
        />
        <Input
          type="text"
          label="Serie"
          id="Serie"
          wrapperClass="col"
          value={verbale ? verbale.blocchettario.serie : ""}
          readOnly
        />
        <Input
          type="text"
          label="Mancata contestazione"
          id="Mancata contestazione"
          wrapperClass="col"
          value={verbale ? verbale.blocchettario.mancatacontestazione : ""}
          readOnly
        />
      </div>
      <div className="form-row">
        <Input
          type="text"
          label="Descrizione"
          id="Descrizione"
          wrapperClass="col"
          value={verbale ? verbale.blocchettario.descrizione : ""}
          readOnly
        />
      </div>
      <h6 style={{ marginBottom: 20 }}>Informazioni veicolo</h6>
      <div className="form-row">
        <Input
          type="text"
          label="Targa"
          id="Targa"
          wrapperClass="col"
          value={verbale ? verbale.targaveicolo : ""}
          readOnly
        />
        <Input
          type="text"
          label="Tipo targa"
          id="Tipo targa"
          wrapperClass="col"
          value={verbale ? verbale.tipotarga : ""}
          readOnly
        />
        <Input
          type="text"
          label="Tipo veicolo"
          id="Tipo veicolo"
          wrapperClass="col"
          value={verbale ? verbale.tipoveicolo : ""}
          readOnly
        />
      </div>
      {verbale && verbale.proprietario ? (
        <div>
      <h6 style={{ marginBottom: 20 }}>Informazioni proprietario</h6>
      <div className="form-row">
        <Input
          type="text"
          label="Nome e cognome"
          id="Nome e cognome"
          wrapperClass="col"
          value={
            verbale && verbale.proprietario
              ? `${verbale.proprietario.nome} ${verbale.proprietario.cognome}`
              : ""
          }
          readOnly
        />
        <Input
          type="text"
          label="Codice fiscale"
          id="Codice fiscale"
          wrapperClass="col"
          value={
            verbale && verbale.proprietario
              ? verbale.proprietario.codfiscale
              : ""
          }
          readOnly
        />
        <Input
          type="text"
          label="Data di nascita"
          id="Data di nascita"
          wrapperClass="col"
          value={
            verbale && verbale.proprietario
              ? verbale.proprietario.data_nascita
              : ""
          }
          readOnly
        />
      </div> </div>): <Alert color='danger'>
      Nessuna informazione per il <b>Proprietario</b>!
    </Alert>}

    {verbale && verbale.tutore ? (
        <div>
      <h6 style={{ marginBottom: 20 }}>Informazioni tutore</h6>
      <div className="form-row">
        <Input
          type="text"
          label="Nome e cognome"
          id="Nome e cognome"
          wrapperClass="col"
          value={
            verbale && verbale.tutore
              ? `${verbale.tutore.nome} ${verbale.tutore.cognome}`
              : ""
          }
          readOnly
        />
        <Input
          type="text"
          label="Codice fiscale"
          id="Codice fiscale"
          wrapperClass="col"
          value={verbale && verbale.tutore ? verbale.tutore.codfiscale : ""}
          readOnly
        />
        <Input
          type="text"
          label="Data di nascita"
          id="Data di nascita"
          wrapperClass="col"
          value={verbale && verbale.tutore ? verbale.tutore.data_nascita : ""}
          readOnly
        />
      </div> </div>): <Alert color='danger'>
      Nessuna informazione per il <b>Tutore</b>!
    </Alert>}

    {verbale && verbale.trasgressore ? (
        <div>
      <h6 style={{ marginBottom: 20 }}>Informazioni trasgressore</h6>
      <div className="form-row">
        <Input
          type="text"
          label="Nome e cognome"
          id="Nome e cognome"
          wrapperClass="col"
          value={
            verbale && verbale.trasgressore
              ? `${verbale.trasgressore.nome} ${verbale.trasgressore.cognome}`
              : ""
          }
          readOnly
        />
        <Input
          type="text"
          label="Codice fiscale"
          id="Codice fiscale"
          wrapperClass="col"
          value={
            verbale && verbale.trasgressore
              ? verbale.trasgressore.codfiscale
              : ""
          }
          readOnly
        />
        <Input
          type="text"
          label="Data di nascita"
          id="Data di nascita"
          wrapperClass="col"
          value={
            verbale && verbale.trasgressore
              ? verbale.trasgressore.data_nascita
              : ""
          }
          readOnly
        />
      </div> </div>): <Alert color='danger'>
      Nessuna informazione per il <b>Trasgressore</b>!
    </Alert>}
      {verbale &&
        verbale.violazioni.map((item) => (
          <div>
            <h6 style={{ marginBottom: 20 }}>Informazioni violazioni</h6>
            <Row>
              <Col>
              <TextArea
                rows={3}
                label="Descrizione"
                placeholder="Descrizione"
                value={item.descrizione}
                readOnly
              />
              </Col>
              <Col>
                <Input
                  type="text"
                  label="Imp. Ridotto"
                  id="Imp. Ridotto"
                  wrapperClass="col"
                  value={`€ ${item.importoridotto}`}
                  readOnly
                />
                <Input
                  type="text"
                  label="Imp. Ruoli"
                  id="Imp. Ruoli"
                  wrapperClass="col"
                  value={`€ ${item.importoruolo}`}
                  readOnly
                />
                <Input
                  type="text"
                  label="Punti"
                  id="Punti"
                  wrapperClass="col"
                  value={item.punti || "no punti"}
                  readOnly
                />
              </Col>
              </Row>
            <div className="form-row">
            <Input
                  type="text"
                  label="Tot. Imp. Ruolo"
                  id="Tot. Imp. Ruolo"
                  wrapperClass="col"
                  value={verbale
                    ? verbale.violazioni
                        .filter((item) => item.importoruolo)
                        .reduce(
                          (partialSum, a) =>
                            partialSum + a.importoruolo,
                          0
                        )
                    : ""}
                  readOnly
                />
                <Input
                  type="text"
                  label="Tot. Imp. Ridotto"
                  id="Tot. Imp. Ridotto"
                  wrapperClass="col"
                  value={`€ ${verbale
                    ? verbale.violazioni
                        .filter((item) => item.importoridotto)
                        .reduce(
                          (partialSum, a) =>
                            partialSum + a.importoridotto,
                          0
                        )
                    : ""}`}
                  readOnly
                />
              </div>
          </div>
        ))}
      <h6 style={{ marginBottom: 20 }}>Comunicazioni dati conducente</h6>
      <div className="form-row">
        <Input
          type="text"
          label="Data Presentazione Documenti"
          id="Data Presentazione Documenti"
          wrapperClass="col"
          value={verbale
            ? verbale.data_presentazione_documenti || "no data"
            : ""}
          readOnly
        />
      </div>
      { verbale && verbale.pagamenti && verbale.pagamenti.length > 0 ? (
                    verbale.pagamenti.map((item) => (
                      <div>
      <h6 style={{ marginBottom: 20 }}>Pagamento</h6>
      <div className="form-row">
        <Input
          type="text"
          label="Data Pagamento"
          id="Data Pagamento"
          wrapperClass="col"
          value={moment(item.data_pagamento).format(
            "DD-MM-YYYY"
          ) || "no data"}
          readOnly
        />
        <Input
          type="text"
          label="Importo Pagato"
          id="Importo Pagato"
          wrapperClass="col"
          value={`€ ${item.importo_pagato || "no data"}`}
          readOnly
        />
        <Input
          type="text"
          label="Metodo di Pagamento"
          id="Metodo di Pagamento"
          wrapperClass="col"
          value={item.metodo_pagamento || "no data"}
          readOnly
        />
        <Input
          type="text"
          label="Estremi Pagamento"
          id="Estremi Pagamento"
          wrapperClass="col"
          value={item.estremi_pagamento || "no dati"}
          readOnly
        />
      </div>
      </div>))) : (<Alert color='danger'>
      Non esistono <b>Pagamenti</b>!
    </Alert>)}
      
      {verbale && verbale.notifiche && verbale.notifiche.length > 0 ? (
                    <div>
                      {verbale.notifiche.map((item) => (
                        <div>
      <h6 style={{ marginBottom: 20 }}>Notifica</h6>
      <div className="form-row">
        <Input
          type="text"
          label="Data Notifica"
          id="Data Notifica"
          wrapperClass="col"
          value={moment(item.data_notifica).format(
            "DD-MM-YYYY"
          ) || "no data"}
          readOnly
        />
        <Input
          type="text"
          label="Tipo"
          id="Tipo"
          wrapperClass="col"
          value={item.tipo_notifica || "no data"}
          readOnly
        />
        <Input
          type="text"
          label="Soggetto"
          id="Soggetto"
          wrapperClass="col"
          value={item.tipo_anagrafica || "no data"}
          readOnly
        />
        </div>

      </div>))}
      </div>): (<Alert color='danger'>
      Non esistono <b>Notifiche</b>!
    </Alert>)}

      {verbale && verbale.ricorsi && verbale.ricorsi.length > 0 ? (
                    <div>
                      {verbale.ricorsi.map((item) => (
                        <div>
      <h6 style={{ marginBottom: 20 }}>Ricorso</h6>
      <div className="form-row">
        <Input
          type="text"
          label="Data Ricorso"
          id="Data Ricorso"
          wrapperClass="col"
          value={moment(item.data_inserimento).format(
            "DD-MM-YYYY"
          ) || "no data"}
          readOnly
        />
        <Input
          type="text"
          label="Ente"
          id="Ente"
          wrapperClass="col"
          value={item.ente || "no data"}
          readOnly
        />
        <Input
          type="text"
          label="Soggetto"
          id="Soggetto"
          wrapperClass="col"
          value={item.soggetto_id || "no data"}
          readOnly
        />
        </div>

      </div>))}
      </div>) : (<Alert color='danger'>
      Non esistono <b>Ricorsi</b>!
    </Alert>)}

      
      <h6 style={{ marginBottom: 20 }}>
        Ricorso-immatricolazione-revisione-assicurazione
      </h6>
      <div className="form-row">
        <Input
          type="text"
          label="Data Immatricolazione"
          id="Data Immatricolazione"
          wrapperClass="col"
          value={verbale
            ? moment(verbale.dataimmatricolazione).format(
                "DD-MM-YYYY"
              ) || "no data"
            : ""}
          readOnly
        />
        <Input
          type="text"
          label="Data Scadenza Revisione"
          id="Data Scadenza Revisione"
          wrapperClass="col"
          value={verbale
            ? moment(verbale.datarevisione).format(
                "DD-MM-YYYY"
              ) || "no data"
            : ""}
          readOnly
        />
        <Input
          type="text"
          label="Data Scadenza Assicurazione"
          id="Data Scadenza Assicurazione"
          wrapperClass="col"
          value={verbale
            ? moment(verbale.dataassicurazione).format(
                "DD-MM-YYYY"
              ) || "no data"
            : ""}
          readOnly
        />
      </div>
      </div>
    <Footer />
    </div>
  );
};

export default Verbale;