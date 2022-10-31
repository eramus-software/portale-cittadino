import axios from "axios";
import { baseUrl } from "../utils/config";
import fileDownload from "js-file-download";

const s = localStorage.getItem('subdomain');

export const getVerbale = async (id) => {
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

export const getDocumentiVerbale = async (id) => {
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

export const downloadDocumentoVerbale = async (id) => {
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

export const getFileVerbale = async (id, name, codice) => {
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
