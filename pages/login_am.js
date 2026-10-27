import React from "react";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "typeface-titillium-web";
import "typeface-roboto-mono";
import "typeface-lora";
import axios from "axios";
import { FileEarmarkText } from "react-bootstrap-icons";
import { baseUrlAm } from "../utils/config";
import AccessoVerbale from "../components/AccessoVerbale";

const Loginam = () => {
  const getVerbale = async (codice) => {
    const response = await axios.get(baseUrlAm() + `/verbali/public/${codice}`);
    // L'API risponde 200 con "data" vuoto se il codice non esiste
    if (!response.data?.data?.length) throw new Error("Verbale non trovato");
    return response;
  };

  return (
    <AccessoVerbale
      eyebrow="Sanzioni Amministrative"
      title="Accesso verbale Sanzioni Amministrative"
      icon={FileEarmarkText}
      verifica={getVerbale}
      destinazione="/verbale_am"
    />
  );
};

export default Loginam;
