import React, {useEffect, useState} from "react";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "typeface-titillium-web";
import "typeface-roboto-mono";
import "typeface-lora";
import { AppContext } from "../context/appContext";

const App = ({ Component, pageProps }) => {
  //const pathname = window.location.pathname
  const [currentPath, setCurrentPath] = useState("")
  const [codiceVerbale, setCodiceVerbale] = useState(undefined)
  const [s, setS] = useState(undefined)

  useEffect(() => {
    console.log('subdomain: ', window.location.host.split('.')[0])
    localStorage.setItem('subdomain', window.location.host.split('.')[0])
    setS(window.location.host.split('.')[0])

  }, [])

  /*useEffect(() => {
    setCurrentPath(pathname)
  }, [pathname])*/

  //const [subdomain, setSubdomain] = useState('')

  /*useEffect(() => {
    const s = localStorage.getItem('subdomain');
    setSubdomain(s)
  }, [subdomain])*/
  
  return (
    <div>
      <AppContext.Provider value={{
        // data,
        //currentPath,
        //setCurrentPath,
        codiceVerbale,
        setCodiceVerbale,
        s,
        setS
      }}>
        <Component />
      </AppContext.Provider>
    </div>
  );
};

export default App;
