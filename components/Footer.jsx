import { Col, Container, Row,Icon} from "design-react-kit";
import dynamic from 'next/dynamic';

export default function Footer() {

  /*const Col = dynamic(() => import('design-react-kit').then((module) => module.Col), {
    ssr: false,
  });
  const Container = dynamic(() => import('design-react-kit').then((module) => module.Container), {
    ssr: false,
  });
  const Row = dynamic(() => import('design-react-kit').then((module) => module.Row), {
    ssr: false,
  });
  const Icon = dynamic(() => import('design-react-kit').then((module) => module.Icon), {
    ssr: false,
  });*/

  const s = localStorage.getItem('subdomain');
    return (
        <footer className="it-footer">
        <div className="it-footer-main">
          <Container>
            <section>
              <Row className="clearfix">
                <Col sm={12}>
                  <div className="it-brand-wrapper">
                    <a className="" href="#">
                      <Icon icon="it-pa" />
                      <div className="it-brand-text">
                        <h2>Comune di {s}</h2>
                        <h3 className="d-none d-md-block">
                          Portale del Cittadino
                        </h3>
                      </div>
                    </a>
                  </div>
                </Col>
              </Row>
            </section>
          </Container>
        </div>
        <div className="it-footer-small-prints clearfix">
          <Container>
            <h3 className="sr-only">Sezione Link Utili</h3>
            <ul className="it-footer-small-prints-list list-inline mb-0 d-flex flex-column flex-md-row">
              <li className="list-inline-item">
                <a href="#" title="Note Legali">
                  Media policy
                </a>
              </li>
              <li className="list-inline-item">
                <a href="#" title="Note Legali">
                  Note legali
                </a>
              </li>
              <li className="list-inline-item">
                <a href="#" title="Privacy-Cookies">
                  Privacy policy
                </a>
              </li>
              <li className="list-inline-item">
                <a href="#" title="Mappa del sito">
                  Mappa del sito
                </a>
              </li>
            </ul>
          </Container>
        </div>
      </footer>
    )
}