import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobeView from "./GlobeView";
import CountryPage from "./CountryPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GlobeView />} />
        <Route path="/country/:code" element={<CountryPage />} />
      </Routes>
    </Router>
  );
}