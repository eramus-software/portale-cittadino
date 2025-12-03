import React from "react";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "typeface-titillium-web";
import "typeface-roboto-mono";
import "typeface-lora";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Button, Row, Col, Container, Icon } from "design-react-kit"; // Importazione dei componenti DRK

const MyHeader = dynamic(() => import("../components/MyHeader"), {
  ssr: false,
});

// Importiamo il Footer sapendo che usa design-react-kit
const Footer = dynamic(() => import("../components/Footer"), {
  ssr: false,
});

const SelectionPage = () => {
  const router = useRouter();

  const handleCodiceStrada = () => {
    router.push("/login");
  };

  const handleSanzioniAmministrative = () => {
    router.push("/login_am");
  };

  return (
    // Contenitore principale: d-flex flex-column min-vh-100 per lo Sticky Footer
    <div className="d-flex flex-column min-vh-100">
      <MyHeader />

      {/* Contenitore centrale: flex-grow-1 per occupare lo spazio rimanente */}
      <Container className="d-flex flex-column align-items-center justify-content-center flex-grow-1 py-5">
        <div className="text-center mb-5">
          <h1 className="mb-3">Seleziona il tipo di verbale</h1>
          <p className="text-muted">
            Scegli la tipologia di verbale che desideri consultare
          </p>
        </div>

        {/* Uso del componente Row e Col di design-react-kit */}
        <Row className="w-100" style={{ maxWidth: "800px" }}>
          {/* Pulsante 1: Codice della Strada */}
          <Col md={6} className="mb-4 mb-md-0">
            <Button
              color="primary" // Corrisponde a btn-primary
              size="lg" // Corrisponde a btn-lg
              className="w-100 py-4"
              onClick={handleCodiceStrada}
              style={{ height: "180px" }}
            >
              <div className="d-flex flex-column align-items-center justify-content-center h-100">
                {/* Uso del componente Icon di design-react-kit */}
                <Icon
                  icon="it-calendar" // L'icona è it-calendar
                  className="icon-white icon-xl mb-3"
                  aria-hidden="true"
                />
                <span className="h5 mb-2">Verbale Codice della Strada</span>
                <small className="text-white-50">
                  Infrazioni al codice della strada
                </small>
              </div>
            </Button>
          </Col>

          {/* Pulsante 2: Sanzioni Amministrative */}
          <Col md={6}>
            <Button
              color="secondary" // Corrisponde a btn-secondary
              size="lg" // Corrisponde a btn-lg
              className="w-100 py-4"
              onClick={handleSanzioniAmministrative}
              style={{ height: "180px" }}
            >
              <div className="d-flex flex-column align-items-center justify-content-center h-100">
                {/* Uso del componente Icon di design-react-kit */}
                <Icon
                  icon="it-file" // L'icona è it-file
                  className="icon-white icon-xl mb-3"
                  aria-hidden="true"
                />
                <span className="h5 mb-2">Verbale Sanzioni Amministrative</span>
                <small className="text-white-50">
                  Altre sanzioni amministrative
                </small>
              </div>
            </Button>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default SelectionPage;
