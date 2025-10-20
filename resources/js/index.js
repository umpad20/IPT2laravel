import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Router from "./components/router";

// Import login/register styles
import "../sass/login.scss";

// Clear previous login (only for testing, remove in production)
localStorage.removeItem("user");
localStorage.removeItem("token");

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);
