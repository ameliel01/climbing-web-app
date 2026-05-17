import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const inverseCotationScale = {
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6a",
  7: "6b",
  8: "6c",
  9: "7a",
  10: "7b",
  11: "7c",
  12: "8a",
  13: "8b",
  14: "8c",
  15: "9a",
  16: "9b",
  17: "9c",
  18: "10a",
};

export default function RouteChart({ user_id, testMode = false }) {
  const [routes, setRoutes] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Récupérer toutes les voies grimpées par l'utilisateur
    axios
      .get(
        `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api/routes/${user_id}`
      )
      .then((response) => {
        console.log("Fetched routes:", response.data);
        setRoutes(response.data.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des voies:", error);
      });
  }, [user_id]);

  useEffect(() => {
    // Transforme routes en format pour recharts
    const formatted = routes.map((route) => ({
      date: route.date,
      cotation: Number(route.cotation), // convertit en nombre pour YAxis
      typeOfRoute: route.typeOfRoute,
    }));
    setData(formatted);
  }, [routes]);

  return (
    <div className="route-chart">
      {/* Filtrage par type de voie, etc. */}
      <div className="route-filters">
        {/* Ici tes checkbox */}
      </div>

      <ResponsiveContainer width={testMode ? 500 : "100%"} height={400}>
        <LineChart data={data} data-testid="line-chart">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            label={{ value: "Date", position: "insideBottomRight", offset: -5 }}
          />
          <YAxis
            label={{ value: "Cotation", angle: -90, position: "insideLeft" }}
            domain={[1, 18]}
            allowDecimals={false}
            tickFormatter={(value) => inverseCotationScale[value] || value}
          />
          <Tooltip formatter={(value) => inverseCotationScale[value] || value} />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="linear"
            dataKey="cotation"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
