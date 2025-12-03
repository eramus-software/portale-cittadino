export const baseUrl = () => {
  // FIXME: LOCALSTORAGE is not working on server
  const subdomain = localStorage.getItem("subdomain");
  return `https://${subdomain}.api.openpol.openpa.cloud/api/portale/v1`;
  //return `http://${subdomain}.lvh.me:3001/api/v1`
  //return `https://uno.openpa.services/api/v1`;
};
export const baseUrlAm = () => {
  // FIXME: LOCALSTORAGE is not working on server
  const subdomain = localStorage.getItem("subdomain");
  return `https://${subdomain}.api.openpolam.openpa.cloud/api/v1`;
  //return `http://${subdomain}.lvh.me:3001/api/v1`
  //return `https://uno.openpa.services/api/v1`;
};
