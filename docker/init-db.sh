#!/bin/bash
set -e

# Créer la base de données "climbing_app" après le démarrage du conteneur
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE climbing_app;
EOSQL
