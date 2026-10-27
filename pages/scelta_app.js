import React from "react";
import "bootstrap-italia/dist/css/bootstrap-italia.min.css";
import "typeface-titillium-web";
import "typeface-roboto-mono";
import "typeface-lora";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  CarFront,
  Download,
  FileEarmarkText,
  InfoCircle,
} from "react-bootstrap-icons";
import { MANUALE_URL } from "../components/AccessoVerbale";
import styles from "../styles/Portale.module.css";

const MyHeader = dynamic(() => import("../components/MyHeader"), {
  ssr: false,
});

const Footer = dynamic(() => import("../components/Footer"), {
  ssr: false,
});

const scelte = [
  {
    tipo: "cds",
    href: "/login",
    icon: CarFront,
    title: "Verbale Codice della Strada",
    text: "Infrazioni al codice della strada: consulta il verbale, i punti decurtati, i documenti e paga con pagoPA.",
  },
  {
    tipo: "sanzioni",
    href: "/login_am",
    icon: FileEarmarkText,
    title: "Verbale Sanzioni Amministrative",
    text: "Violazioni di regolamenti e ordinanze comunali e altre sanzioni amministrative.",
  },
];

const SelectionPage = () => {
  const router = useRouter();

  function scegli(scelta) {
    if (typeof window !== "undefined")
      localStorage.setItem("tipoRicerca", scelta.tipo);
    router.push(scelta.href);
  }

  return (
    // Sticky footer: il contenuto centrale occupa lo spazio rimanente
    <div className="d-flex flex-column min-vh-100">
      <MyHeader title="Portale cittadino" />

      <main className={styles.page}>
        <div className={`container ${styles.inner}`}>
          <div className={styles.intro}>
            <span className={styles.eyebrow}>Atti online</span>
            <h1 className={styles.title}>Consulta il tuo verbale</h1>
            <p className={styles.subtitle}>
              Scegli la tipologia di verbale ricevuto: potrai inserire il codice
              univoco e visualizzarne tutti i dettagli.
            </p>
          </div>

          <div className={styles.choices}>
            {scelte.map(({ icon: Icon, ...scelta }) => (
              <button
                key={scelta.tipo}
                type="button"
                className={styles.choice}
                onClick={() => scegli(scelta)}
              >
                <span className={styles.choiceIcon}>
                  <Icon size={22} />
                </span>
                <span className={styles.choiceTitle}>{scelta.title}</span>
                <span className={styles.choiceText}>{scelta.text}</span>
                <span className={styles.choiceCta}>
                  Accedi <ArrowRight />
                </span>
              </button>
            ))}
          </div>

          <div className={styles.help}>
            <span className={styles.helpIcon}>
              <InfoCircle size={16} />
            </span>
            <div className={styles.helpText}>
              <strong>Dove trovo il codice univoco?</strong>
              È riportato sul verbale notificato. Per una guida passo passo
              consulta il manuale d&apos;uso.
            </div>
            <a href={MANUALE_URL} download className={styles.helpBtn}>
              <Download /> Scarica manuale
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SelectionPage;
