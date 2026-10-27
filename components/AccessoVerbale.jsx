import React, { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Download,
  ExclamationOctagon,
  InfoCircle,
  Search,
} from "react-bootstrap-icons";
import { useAppContext } from "../context/appContext";
import styles from "../styles/Portale.module.css";

const MyHeader = dynamic(() => import("./MyHeader"), { ssr: false });
const Footer = dynamic(() => import("./Footer"), { ssr: false });

export const MANUALE_URL = "/Openpol Manuale d’Uso Atti Online.pdf";

/**
 * Form di accesso al verbale tramite codice univoco, condiviso da CDS e AM.
 * verifica(codice): promise che fallisce se il codice non corrisponde a un verbale.
 */
export default function AccessoVerbale({ eyebrow, title, icon: Icon, verifica, destinazione }) {
  const router = useRouter();
  const { codiceVerbale, setCodiceVerbale } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState(false);

  const codice = (codiceVerbale || "").trim();

  async function goToVerbale(e) {
    e.preventDefault();
    if (!codice) return;
    setLoading(true);
    setErrore(false);
    try {
      await verifica(codice);
      setCodiceVerbale(codice);
      router.push(destinazione);
    } catch (err) {
      setErrore(true);
      setLoading(false);
    }
  }

  function tornaAllaScelta() {
    setCodiceVerbale("");
    router.push("/");
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <MyHeader />

      <main className={styles.page}>
        <div className={`container ${styles.narrow}`}>
          <button type="button" className={styles.backLink} onClick={tornaAllaScelta}>
            <ArrowLeft /> Cambia tipo di verbale
          </button>

          <form className={styles.card} onSubmit={goToVerbale} noValidate>
            <div className={styles.cardHead}>
              {Icon ? (
                <span className={styles.cardIcon}>
                  <Icon size={24} />
                </span>
              ) : null}
              <div>
                <span className={styles.cardKicker}>{eyebrow}</span>
                <h1 className={styles.cardTitle}>{title}</h1>
              </div>
            </div>
            <p className={styles.cardText}>
              Inserisci il codice indicato sul verbale ricevuto per accedere a
              tutte le informazioni del verbale.
            </p>

            <label className={styles.label} htmlFor="codiceVerbale">
              Codice verbale
            </label>
            <input
              id="codiceVerbale"
              type="text"
              className={styles.input}
              placeholder="Es. A1B2C3D4"
              autoComplete="off"
              value={codiceVerbale || ""}
              onChange={(e) => {
                setCodiceVerbale(e.currentTarget.value);
                setErrore(false);
              }}
              disabled={loading}
              aria-invalid={errore || undefined}
              aria-describedby="codiceVerbaleHint"
            />
            <p id="codiceVerbaleHint" className={styles.hint}>
              Il codice univoco è riportato sul verbale notificato.
            </p>

            {errore ? (
              <div className={styles.error} role="alert">
                <ExclamationOctagon />
                <div>
                  <strong>Codice univoco errato</strong>
                  Il codice non corrisponde a nessun verbale: controlla di
                  averlo inserito correttamente e riprova.
                </div>
              </div>
            ) : null}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.btn}
                onClick={tornaAllaScelta}
                disabled={loading}
              >
                <ArrowLeft /> Indietro
              </button>
              <button
                type="submit"
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={loading || !codice}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Ricerca in corso...
                  </>
                ) : (
                  <>
                    <Search /> Cerca verbale
                  </>
                )}
              </button>
            </div>
          </form>

          <div className={styles.help}>
            <span className={styles.helpIcon}>
              <InfoCircle size={16} />
            </span>
            <div className={styles.helpText}>
              <strong>Hai bisogno di aiuto?</strong>
              Consulta il manuale d&apos;uso del portale.
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
}
