import React from "react";
import ReactDOM from "react-dom/client";  // Correct import
import "bootstrap/dist/css/bootstrap.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your app
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);