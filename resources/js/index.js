import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Router from "./components/router"; // <-- use router.js

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <BrowserRouter>
        <Router />
    </BrowserRouter>
);
