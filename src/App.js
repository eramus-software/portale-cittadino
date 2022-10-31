import React, {useEffect, useState} from "react";
import "./App.css";
import { Col, Button, Container, Row } from "design-react-kit";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "typeface-titillium-web";
import "typeface-roboto-mono";
import "typeface-lora";
import {
  BrowserRouter,
  Routes, //replaces "Switch" used till v5
  Route,
  Link,
  useLocation
} from "react-router-dom";
import Login from "./pages/Login";
import Verbale from "./pages/Verbale";
import { AppContext } from "./context/appContext";

const App = () => {
  const pathname = window.location.pathname
  const [currentPath, setCurrentPath] = useState(pathname)
  const [codiceVerbale, setCodiceVerbale] = useState(undefined)

  useEffect(() => {
    console.log('subdomain: ', window.location.host.split('.')[0])
    localStorage.setItem('subdomain', window.location.host.split('.')[0])
  }, [])

  useEffect(() => {
    setCurrentPath(pathname)
  }, [pathname])

  const [subdomain, setSubdomain] = useState('')

  useEffect(() => {
    const s = localStorage.getItem('subdomain');
    setSubdomain(s)
  }, [subdomain])

  const handleChange = (e) => {
    const value = e.currentTarget.value;
    const name = e.currentTarget.name;

    setCodiceVerbale( value );

  };

  console.log("Login", currentPath)
  
  return (
    <div>
      <BrowserRouter>
      <AppContext.Provider value={{
        // data,
        currentPath,
        setCurrentPath,
        codiceVerbale,
        setCodiceVerbale,
      }}>
      <Container>
      <Routes>
            <Route path="/" element={<Login />} />
           <Route path="/verbale" element={<Verbale />} />
      </Routes>
      </Container>
      </AppContext.Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
