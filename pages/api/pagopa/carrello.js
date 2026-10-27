import axios from "axios";

// API "carrello" di pagoPA Checkout: risponde 302 con l'URL della pagina di
// pagamento. La chiamata parte dal server perche' dal browser non si puo'
// leggere la Location di un redirect cross-origin.
// In collaudo: PAGOPA_CHECKOUT_CARTS_URL=https://api.uat.platform.pagopa.it/checkout/ec/v1/carts
const CARTS_URL =
  process.env.PAGOPA_CHECKOUT_CARTS_URL ||
  "https://api.platform.pagopa.it/checkout/ec/v1/carts";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { paymentNotices, returnUrl } = req.body || {};
  if (!Array.isArray(paymentNotices) || paymentNotices.length < 1 || paymentNotices.length > 5) {
    return res.status(400).json({ error: "Il carrello deve contenere da 1 a 5 avvisi" });
  }

  try {
    const response = await axios.post(
      CARTS_URL,
      {
        paymentNotices,
        returnUrls: {
          returnOkUrl: returnUrl,
          returnCancelUrl: returnUrl,
          returnErrorUrl: returnUrl,
        },
      },
      {
        headers: { "Content-Type": "application/json" },
        maxRedirects: 0,
        validateStatus: (status) => status === 302,
      }
    );
    return res.status(200).json({ url: response.headers.location });
  } catch (error) {
    console.error(
      "Errore creazione carrello pagoPA:",
      error.response?.status,
      error.response?.data || error.message
    );
    return res.status(502).json({ error: "Impossibile creare il carrello pagoPA" });
  }
}
