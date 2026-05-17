import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: `https://${process.env.REACT_APP_HOST}:8443`,
  realm: "main",
  clientId: "climber",
});

export default keycloak;
