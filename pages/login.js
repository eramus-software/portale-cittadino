import React from "react";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "typeface-titillium-web";
import "typeface-roboto-mono";
import "typeface-lora";
import axios from "axios";
import { CarFront } from "react-bootstrap-icons";
import { useAppContext } from "../context/appContext";
import { baseUrl } from "../utils/config";
import AccessoVerbale from "../components/AccessoVerbale";

const Login = () => {
  const { s } = useAppContext();

  const getVerbale = async (codice) => {
    const response = await axios.get(baseUrl() + `/verbali/${codice}`, {
      headers: {
        "X-Api-Key": s,
      },
    });
    return response;
  };

  return (
    <AccessoVerbale
      eyebrow="Codice della Strada"
      title="Accesso verbale Codice della Strada"
      icon={CarFront}
      verifica={getVerbale}
      destinazione="/verbale"
    />
  );
};

export default Login;
