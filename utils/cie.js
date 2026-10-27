// Login CIE tramite eramus_ids (OpenID Connect, authorization code flow)

export const IDP_URL =
  process.env.NEXT_PUBLIC_CIE_IDP_URL ||
  "https://eramusidp-a22dda1def2f.herokuapp.com";
export const CLIENT_ID =
  process.env.NEXT_PUBLIC_CIE_CLIENT_ID || "portalecittadino";

const CHIAVE_LOGIN = "cieLogin";
const CHIAVE_CITTADINO = "cittadino";

const casuale = () => {
  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
};

// Il comune è il sottodominio (uno.portalecittadino.openpa.cloud → uno)
export const comune = () => window.location.host.split(".")[0];

// Deve coincidere con il redirect_uri registrato per il portale in eramus_ids
export const redirectUri = () => `${window.location.origin}/`;

export const avviaLogin = () => {
  const state = casuale();
  const nonce = casuale();
  sessionStorage.setItem(CHIAVE_LOGIN, JSON.stringify({ state, nonce }));

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri(),
    response_type: "code",
    state,
    nonce,
  });
  window.location.href = `${IDP_URL}/${comune()}/authorize/cie?${params}`;
};

// Gestisce il ritorno da CIE (?code=…&state=… oppure ?error=…).
// Ritorna null se l'URL non contiene un ritorno da CIE, altrimenti { cittadino } o { errore }.
export const completaLogin = async (query) => {
  if (!query.code && !query.error) return null;

  // Letto e cancellato subito: un secondo tentativo con lo stesso ritorno viene ignorato
  const login = JSON.parse(sessionStorage.getItem(CHIAVE_LOGIN) || "null");
  sessionStorage.removeItem(CHIAVE_LOGIN);
  if (!login || login.state !== query.state) return null;

  if (query.error) {
    return {
      errore:
        query.error === "access_denied"
          ? "Accesso con CIE annullato."
          : "Accesso con CIE non riuscito.",
    };
  }

  const risposta = await fetch("/api/cie/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: query.code,
      comune: comune(),
      redirect_uri: redirectUri(),
      nonce: login.nonce,
    }),
  });
  if (!risposta.ok) return { errore: "Accesso con CIE non riuscito." };

  const cittadino = await risposta.json();
  sessionStorage.setItem(CHIAVE_CITTADINO, JSON.stringify(cittadino));
  return { cittadino };
};

export const cittadinoCorrente = () =>
  JSON.parse(sessionStorage.getItem(CHIAVE_CITTADINO) || "null");

export const esci = () => sessionStorage.removeItem(CHIAVE_CITTADINO);
