import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobeView from "./GlobeView";
import CountryPage from "./CountryPage";
import CountryDetails from './CountryDetails';
import CountryDashboard from './CountryDashboard';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GlobeView />} />
        <Route path="/country/:code" element={<CountryPage />} />
        <Route path="/country/:code/details" element={<CountryDetails />} />
        <Route path="/country/:code/dashboard" element={<CountryDashboard />} />
      </Routes>
    </Router>
  );
}