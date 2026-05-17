// RouteHistory.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RouteHistory.css";
import "./cotation";
import { inverseCotationScale } from "./cotation";
import RouteForm from "./RouteForm";

const RouteHistory = ({ user_id }) => {
  const [routes, setRoutes] = useState([]);
  const [routeToEdit, setRouteToEdit] = useState(null);

  useEffect(() => {
    // Récupérer toutes les voies grimpées par l'utilisateur
    axios
      .get(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/routes/${user_id}`
      )
      .then((response) => {
        setRoutes(response.data.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des voies:", error);
      });
  }, [user_id]);

  const handleDelete = (routeId) => {
    axios
      .delete(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/routes/${routeId}/`
      )
      .then(() => {
        setRoutes(routes.filter((route) => route.id !== routeId));
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de la voie:", error);
      });
  };

  const handleEdit = (route) => {
    setRouteToEdit(route);
  };

  const handleEditComplete = () => {
    setRouteToEdit(null);
    axios
      .get(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/routes/${user_id}`
      )
      .then((response) => {
        setRoutes(response.data.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des voies:", error);
      });
  };

  return (
    <div className="route-history">
      <h2>Historique des Voies Grimpées</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Cotation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((route) => (
              <tr key={route.id} id={`route-row-${route.id}`}>
                <td id={`route-date-${route.id}`}>{route.date}</td>
                <td id={`route-type-${route.id}`}>{route.typeOfRoute}</td>
                <td id={`route-cotation-${route.id}`}>
                  {inverseCotationScale[route.cotation]}
                </td>
                <td>
                  <button
                    id={`edit-button-${route.id}`}
                    onClick={() => handleEdit(route)}>
                    Modifier
                  </button>
                  <button
                    id={`delete-button-${route.id}`}
                    onClick={() => handleDelete(route.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {routeToEdit && (
        <RouteForm
          user_id={user_id}
          routeToEdit={routeToEdit}
          onEditComplete={handleEditComplete}
        />
      )}
    </div>
  );
};

export default RouteHistory;
