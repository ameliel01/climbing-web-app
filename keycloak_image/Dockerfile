FROM quay.io/keycloak/keycloak:latest AS builder

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Configure a database vendor
ENV KC_DB=postgres

WORKDIR /opt/keycloak

# Add the provider JAR file to the providers directory
ADD --chown=keycloak:keycloak --chmod=644 keycloak-theme-0.0.3-SNAPSHOT.jar providers/keycloak-theme.jar

# for demonstration purposes only, please make sure to use proper certificates in production instead
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:latest
COPY --from=builder /opt/keycloak/ /opt/keycloak/

COPY cert.pem /opt/keycloak/ssl/cert.pem
COPY key.pem /opt/keycloak/ssl/key.pem
COPY main.json /opt/keycloak/data/import/

RUN ls -l /opt/keycloak/data/import

# change these values to point to a running postgres instance
ENV KC_DB=postgres
ENV KC_DB_URL=jdbc:postgresql://docker-db-1:5432/keycloak
ENV KC_DB_USERNAME=keycloak
ENV KC_DB_PASSWORD=password
ENV KC_HOSTNAME=https://209.38.231.152:8443
ENV KEYCLOAK_ADMIN=zeynel
ENV KEYCLOAK_ADMIN_PASSWORD=password

EXPOSE 8080
EXPOSE 8443

COPY docker-entry-point.sh /

ENTRYPOINT ["/docker-entry-point.sh"]
