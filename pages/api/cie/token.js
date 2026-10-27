// Scambio del codice CIE con i token: lato server, perché usa il client_secret del portale
import axios from "axios";

const IDP_URL =
  process.env.NEXT_PUBLIC_CIE_IDP_URL ||
  "https://eramusidp-a22dda1def2f.herokuapp.com";
const CLIENT_ID = process.env.NEXT_PUBLIC_CIE_CLIENT_ID || "portalecittadino";
const CLIENT_SECRET = process.env.CIE_CLIENT_SECRET;

const SLUG = /^[a-z0-9][a-z0-9-]{0,62}$/;

const payloadJwt = (jwt) =>
  JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString("utf8"));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Metodo non consentito" });
  }
  if (!CLIENT_SECRET) {
    console.error("[cie] CIE_CLIENT_SECRET non configurato");
    return res.status(500).json({ error: "configurazione" });
  }

  const { code, comune, redirect_uri, nonce } = req.body || {};
  if (!code || !SLUG.test(comune || "") || !redirect_uri) {
    return res.status(400).json({ error: "richiesta_non_valida" });
  }

  try {
    const { data } = await axios.post(
      `${IDP_URL}/${comune}/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // id_token ricevuto direttamente da eramus_ids su HTTPS: si controllano emittente, destinatario e nonce
    const claims = payloadJwt(data.id_token);
    if (
      claims.iss !== `${IDP_URL}/${comune}` ||
      claims.aud !== CLIENT_ID ||
      claims.nonce !== nonce
    ) {
      console.error("[cie] id_token non valido per questo portale");
      return res.status(401).json({ error: "token_non_valido" });
    }

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      sub: claims.sub,
      comune: claims.comune,
      fiscal_number: claims.fiscal_number,
      given_name: claims.given_name,
      family_name: claims.family_name,
      birthdate: claims.birthdate,
    });
  } catch (e) {
    console.error("[cie] scambio codice fallito:", e.response?.data || e.message);
    return res.status(401).json({ error: "accesso_non_riuscito" });
  }
}
