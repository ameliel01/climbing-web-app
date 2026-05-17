import React from "react";
import { ReactKeycloakProvider, useKeycloak } from "@react-keycloak/web"; // Import useKeycloak
import keycloak from "./keycloak"; // Import the Keycloak instance
import Layout from './components/Layout';
import Home from './views/Home';
import Message from './views/Message';
import Search from './views/Search';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ClimbPage from "./ClimbPage";

const eventLogger = (event, error) => {
  console.log("onKeycloakEvent", event, error);
};

function AppContent() {
  const { keycloak, initialized } = useKeycloak(); // Use the hook here

  if (!initialized) {
    return <div>Loading...</div>; // Show a loading state while Keycloak initializes
  }

  return (
    keycloak.authenticated && ( // Check if the user is authenticated
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route exact path="/home" element={<Home user_id={keycloak.tokenParsed?.sub}/>} />
              <Route exact path="/messages" element={<Message user_id={keycloak.tokenParsed?.sub}/>} />
              <Route exact path="/" element={<ClimbPage />} />
              <Route exact path="/search" element={<Search user_id={keycloak.tokenParsed?.sub} />}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
    )
  );
}

function App() {
  return (
    <ReactKeycloakProvider
      authClient={keycloak} // Pass the Keycloak instance here
      initOptions={{
        onLoad: "login-required",
      }}
      onEvent={eventLogger}
    >
      <AppContent />
    </ReactKeycloakProvider>
  );
}

export default App;
