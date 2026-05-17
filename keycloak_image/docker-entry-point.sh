#!/bin/bash
/opt/keycloak/bin/kc.sh start --import-realm --optimized --http-enabled=true --log-console-color=true --https-port=8443 --https-certificate-file=/opt/keycloak/ssl/cert.pem --https-certificate-key-file=/opt/keycloak/ssl/key.pem
