import React from "react";
//import {Button} from "design-react-kit";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "typeface-titillium-web";
import "typeface-roboto-mono";
import "typeface-lora";
import { useAppContext } from "../context/appContext";
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const MyHeader = dynamic(() => import('../components/MyHeader'), {
  ssr: false,
})
const Footer = dynamic(() => import('../components/Footer'), {
  ssr: false,
})

const Button = dynamic(() => import('design-react-kit').then((module) => module.Button), {
  ssr: false,
});


const Login = () => {

  const router = useRouter()
  //let navigate = useNavigate();
  function goToVerbale() {
    router.push("/verbale");
  }

  const { codiceVerbale, setCodiceVerbale } = useAppContext();

  const handleChange = (e) => {
    const value = e.currentTarget.value;
    const name = e.currentTarget.name;

    setCodiceVerbale(value);
  };

  return (
    <div>
      <MyHeader />
      <section style={{ marginTop: "20%", marginBottom: "23%" }}>
        <div
          className="d-flex flex-row"
          style={{ marginLeft: 250, marginRight: 250 }}
        >
          <input
            type="text"
            className="form-control mr-2"
            id="inlineFormInput"
            placeholder="Codice verbale"
            value={codiceVerbale}
            onChange={handleChange}
          />

          <Button onClick={goToVerbale} type="submit" color="primary">
            Invia
          </Button>
        </div>
      </section>
      <Footer />

    </div>
  );
};

export default Login;
