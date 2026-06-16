import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8011",
  realm: "skyit",
  clientId: "skyit-react",
});

export default keycloak;