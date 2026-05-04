import React from "react";
import { useParams } from "react-router-dom";

const mockData = {
  AT: { name: "Austria" },
  DE: { name: "Germany" },
  GB: { name: "United Kingdom" },
  US: { name: "United States" },
  CA: { name: "Canada" },
  BE: { name: "Belgium" },
  TG: { name: "Togo" },
  FI: { name: "Finland" }
};

const CountryPage = () => {
  const { code } = useParams();

  const data = mockData?.[code];

  if (!data) {
    return <div>Loading or No Data for {code}</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{data.name}</h1>
      <p>Country code: {code}</p>
    </div>
  );
};

export default CountryPage;