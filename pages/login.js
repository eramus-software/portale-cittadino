import React, { useState } from "react";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "typeface-titillium-web";
import "typeface-roboto-mono";
import "typeface-lora";
import { useAppContext } from "../context/appContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/router";
import axios from "axios";
import { baseUrl } from "../utils/config";

import dynamic from "next/dynamic";
//import {Button } from 'design-react-kit'
//import {MyHeader} from '../components/MyHeader'
//import {Footer} from '../components/Footer'

const MyHeader = dynamic(() => import("../components/MyHeader"), {
  ssr: false,
});
const Footer = dynamic(() => import("../components/Footer"), {
  ssr: false,
});

const MyButton = dynamic(() => import("../components/MyButton"), {
  ssr: false,
});
const MyAlert = dynamic(() => import("../components/MyAlert"), {
  ssr: false,
});
const Login = () => {
  const router = useRouter();

  const MyAlert = dynamic(() => import("../components/MyAlert"), {
    ssr: false,
  });
  //let navigate = useNavigate();
  async function goToVerbale() {
    try {
      const response = await getVerbale();
      console.log(response, "ciao bello");
      router.push("/verbale");
    } catch (e) {
      //alert("No verbale");
      handleShow();
    }
  }

  const getVerbale = async () => {
    const response = await axios.get(baseUrl() + `/verbali/${codiceVerbale}`, {
      headers: {
        "X-Api-Key": s, //the token is a variable which holds the token
      },
    });
    return response;
  };

  const { codiceVerbale, setCodiceVerbale, s } = useAppContext();

  //POPUP
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const value = e.currentTarget.value;

    setCodiceVerbale(value);
  };

  return (
    <div>
      <MyHeader />
      <section style={{ marginTop: "20%", marginBottom: "23%" }}>
        <div className="container mx-auto">
          <div className="d-flex flex-column flex-md-row justify-content-between col-12">
            <input
              type="text"
              className="align-self-center mb-4 mb-md-0 col-12 col-md-9"
              id="inlineFormInput"
              placeholder="Codice verbale"
              value={codiceVerbale}
              onChange={handleChange}
            />

            <MyButton
              onClick={goToVerbale}
              className="align-self-center sm:w-full col-12 col-md-2"
              type="submit"
              color="primary"
              title={"Invia"}
            ></MyButton>
          </div>
        </div>
      </section>

      <Footer />

      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header
          className="bg-primary text-white pb-3"
          closeVariant="white"
        >
          <Modal.Title>Errore</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="select-wrapper">
            <div className="d-flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-exclamation-octagon icon icon-danger"
                viewBox="0 0 16 16"
              >
                <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
              </svg>
              <h4 className="ml-4">Codice univoco errato!</h4>
            </div>
            <p>
              Il codice univoco non corrisponde a nessun verbale, è necessario
              provare a ricomporlo in modo corretto
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleClose()}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
