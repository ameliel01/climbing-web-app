import React, { useState, useEffect } from "react";
import axios from "axios";
import { cotationScale } from "./cotation";
import { typeOfRoute } from "./typeOfRoute";
import "./RouteForm.css";

const RouteForm = ({ user_id, routeToEdit, onEditComplete }) => {
  const [formData, setFormData] = useState({
    userId: user_id,
    date: new Date().toISOString().split("T")[0], // Set default date to current date
    route: "Indoor",
    typeOfRoute: typeOfRoute[2],
    cotation: cotationScale["4a"],
    feeling: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (routeToEdit) {
      setFormData({
        userId: routeToEdit.userId,
        date: routeToEdit.date,
        route: routeToEdit.route,
        typeOfRoute: routeToEdit.typeOfRoute,
        cotation: routeToEdit.cotation,
        feeling: routeToEdit.feeling,
      });
    }
  }, [routeToEdit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Première requête : sauvegarder la voie
    const request = routeToEdit
      ? axios.put(
          `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/routes/${routeToEdit.id}/`,
          formData
        )
      : axios.post(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/routes`, formData); // Fixed the URL concatenation

    request
      .then((response) => {
        console.log("Route saved:", response.data);
        const { userId: user_id, id: route_id } = response.data.data;
        // Deuxième requête : créer un post
        axios
          .post(`${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/user/${user_id}/post`, {
            route_id,
            content: null, // Content est défini à null
          })
          .then((postResponse) => {
            console.log("Post created:", postResponse.data);
            setSuccessMessage("Voie sauvegardés avec succès !");
            setTimeout(() => setSuccessMessage(""), 3000);
            if (onEditComplete) onEditComplete();
          })
          .catch((postError) => {
            console.log(postError);
            console.error("Error creating post:", postError);
          });
      })
      .catch((error) => {
        console.error("Error saving route:", error);
      });
  };

  return (
    <div className="route-form-container">
      <form onSubmit={handleSubmit}>
        <input
          id="route-date"
          type="date"
          name="date"
          onChange={handleChange}
          value={formData.date}
        />
        <select id="route-route" name="route" onChange={handleChange} value={formData.route}>
          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>
        </select>
        <label htmlFor="cotation">Choisissez une cotation :</label>
        <select
          id="route-cotation"
          name="cotation"
          value={formData.cotation}
          onChange={handleChange}
        >
          {Object.keys(cotationScale).map((cotation) => (
            <option value={cotationScale[cotation]} key={cotation}>
              {cotation}
            </option>
          ))}
        </select>
        <select
          id="route-typeOfRoute"
          name="typeOfRoute"
          value={formData.typeOfRoute}
          onChange={handleChange}
        >
          {typeOfRoute.map((type) => (
            <option value={type} key={type}>
              {type}
            </option>
          ))}
        </select>
        <textarea
          id="route-feeling"
          name="feeling"
          onChange={handleChange}
          value={formData.feeling}
          placeholder="Comment vous êtes-vous senti ?"
        ></textarea>
        <button type="submit">
          {routeToEdit ? "Modifier la voie" : "Sauvegarder la voie"}
        </button>
      </form>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};

export default RouteForm;
