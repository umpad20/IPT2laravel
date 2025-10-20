import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Router from "./components/router";

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;

// Mount to HTML element
if (document.getElementById("app")) {
  createRoot(document.getElementById("app")).render(<App />);
}
