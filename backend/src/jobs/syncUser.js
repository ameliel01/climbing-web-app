global.crypto = require("crypto").webcrypto;
// Ajoute cette ligne si tu veux forcer le chargement du module
require("dotenv").config();
//const cron = require('node-cron');
const fetch = require("node-fetch");
const { CronJob } = require("cron");
const User = require("../models/user"); // ⬅️ Chemin vers ton modèle
const sequelize = require("../models/database"); // ⬅️ Connexion Sequelize

const https = require("https"); // à mettre en haut du fichier

const agent = new https.Agent({ rejectUnauthorized: false });
// Variables d'env
const { KEYCLOAK_URL, KEYCLOAK_REALM } = process.env;

// === Fonction pour récupérer le token Keycloak ===
async function getAccessToken() {
  // 1. Récupération du token
  if (process.env.NODE_ENV && process.env.NODE_ENV != "test") {
    const res = await fetch(
      `https://${process.env.HOST}:8443/realms/main/protocol/openid-connect/token`,
      {
        method: "POST",
        agent: agent, // Utiliser l'agent pour ignorer les erreurs de certificat
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: "backend",
          client_secret: "Sw1AIlO94wQCXnvARvbPN8gtPWhaJlX7",
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Échec token: ${res.status} - ${text}`);
    }

    const data = await res.json();
    return data.access_token;
  }
}

// === Fonction pour récupérer les utilisateurs ===
async function fetchKeycloakUsers(token) {
  if (process.env.NODE_ENV && process.env.NODE_ENV != "test") {
    const res = await fetch(
      `https://${process.env.HOST}:8443/admin/realms/main/users`,
      {
        agent: agent, // Utiliser l'agent pour ignorer les erreurs de certificat
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Échec utilisateurs: ${res.status} - ${text}`);
    }

    return await res.json();
  }
}

// === Fonction de synchronisation principale ===
async function syncUsers() {
  try {
    // self-signed certificate
    if (!(process.env.NODE_ENV && process.env.NODE_ENV == "production")) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
    const token = await getAccessToken();
    const kcUsers = await fetchKeycloakUsers(token);

    const kcIds = kcUsers.map((u) => u.id);
    const localUsers = await User.findAll({ attributes: ["id"] });
    const localIds = localUsers.map((u) => u.id);

    const toDelete = localIds.filter((id) => !kcIds.includes(id));
    if (toDelete.length > 0) {
      await User.destroy({ where: { id: toDelete } });
      console.log(`Utilisateurs supprimés : ${toDelete.length}`);
    }

    for (const user of kcUsers) {
      const updatedUser = await User.upsert({
        id: user.id,
        email: user.email || null,
        username: user.username || null,
        first_name: user.firstName || null,
        last_name: user.lastName || null,
      });
    }

    console.log(
      `Synchronisation terminée (${kcUsers.length} utilisateurs traités).`
    );
  } catch (err) {
    console.error("Erreur pendant la synchronisation :", err.message);
  }
}

// === Planification cron toutes les 1 minute ===

const job = new CronJob("*/1 * * * *", async () => {
  console.log("Lancement de la synchronisation Keycloak...");
  await syncUsers();
});

// Lancer immédiatement
if (process.env.NODE_ENV !== "test") {
  syncUsers();

  // Démarrer le job

  job.start();
}
