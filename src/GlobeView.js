import React, { useEffect, useState, useRef } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { feature } from "topojson-client";
import { useNavigate } from "react-router-dom";
import { useYear } from "./YearContext";

const GlobeView = () => {
  const globeEl = useRef();
  const navigate = useNavigate();
  const { setSelectedYear } = useYear();

  const [countries, setCountries] = useState([]);
  const [timeIndex, setTimeIndex] = useState(1980);

  // popup state
  const [selectedCountry, setSelectedCountry] = useState(null);

  // name 全名映射
  const countryNameMap = {
    AT: "Austria",
    DE: "Germany",
    GB: "United Kingdom",
    US: "United States",
    CA: "Canada",
    BE: "Belgium",
    TG: "Togo",
    FI: "Finland",
    AU: "Australia"
  };

  const highlightMarkers = [
    { lat: 47.5, lng: 14.5, country: "AT" },
    { lat: 51.0, lng: 10.0, country: "DE" },
    { lat: 54.0, lng: -2.0, country: "GB" },
    { lat: 39.0, lng: -98.0, country: "US" },
    { lat: 56.0, lng: -96.0, country: "CA" },
    { lat: 50.5, lng: 4.5, country: "BE" },
    { lat: 8.0, lng: 1.0, country: "TG" },
    { lat: 64.0, lng: 26.0, country: "FI" },
    { lat: -25.2744, lng: 133.7751, country: "AU" }
  ];

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.4;
    }

    fetch("https://unpkg.com/world-atlas@2/countries-110m.json")
      .then((res) => res.json())
      .then((worldData) => {
        const countries = feature(
          worldData,
          worldData.objects.countries
        ).features;

        setCountries(countries);
      });
  }, []);

  const handleYearChange = (e) => {
    const year = Number(e.target.value);
    setTimeIndex(year);
    setSelectedYear(year);
  };

  return (
    <div style={{ position: "relative" }}>

      {/* 🌟 HUD POPUP（核心新增） */}
      {selectedCountry && (
        <div
          style={{
            position: "absolute",
            top: "18%",
            left: "50%",
            transform: "translateX(-50%)",

            width: "260px",
            padding: "14px",

            background: "rgba(10,26,20,0.78)",
            backdropFilter: "blur(18px)",

            border: "1px solid rgba(168,230,207,0.35)",
            boxShadow: "0 0 18px rgba(168,230,207,0.15)",

            borderRadius: "12px",
            zIndex: 999,

            color: "#A8E6CF",
            fontFamily: "monospace"
          }}
        >
          {/* ⬅ close */}
          <button
            onClick={() => setSelectedCountry(null)}
            style={{
              position: "absolute",
              top: 8,
              left: 8,

              width: "22px",
              height: "22px",

              borderRadius: "4px",
              background: "rgba(168,230,207,0.1)",
              border: "1px solid rgba(168,230,207,0.4)",
              color: "#A8E6CF",

              cursor: "pointer",
              fontSize: "10px"
            }}
          >
            ↵
          </button>

          {/* content 内容 */}
          <div style={{ marginTop: "24px" }}>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>
              {countryNameMap[selectedCountry.country] ||
                selectedCountry.country}
            </div>

            <div style={{ fontSize: "11px", opacity: 0.7, marginTop: "6px" }}>
              {selectedCountry.country}
            </div>

            {timeIndex && (
              <div style={{ fontSize: "11px", marginTop: "6px", color: "#a8e6cf", opacity: 0.8 }}>
                Selected year: <b>{timeIndex}</b>
              </div>
            )}

            <div style={{ fontSize: "11px", marginTop: "10px", opacity: 0.8 }}>
              Environmental / prediction dataset node
            </div>

            {/* DETAIL */}
            <button
              onClick={() =>
                navigate(`/country/${selectedCountry.country}`)
              }
              style={{
                marginTop: "10px",
                width: "100%",

                padding: "8px",

                background: "#A8E6CF",
                border: "none",
                borderRadius: "8px",

                fontWeight: "bold",
                color: "#0A1A14",

                cursor: "pointer"
              }}
            >
              Detail
            </button>
          </div>
        </div>
      )}

      {/*  explaination 上方说明文字 */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,

          color: "#A8E6CF",
          textAlign: "center",
          fontFamily: "monospace",

          maxWidth: "600px",
          fontSize: "13px",
          lineHeight: "1.6",

          opacity: 0.9,
          textShadow: "0 0 10px rgba(168,230,207,0.3)"
        }}
      >
        You can explore how global conditions evolve over time.<br />
        Select a time range to view <b>past 10 years of data</b> or{" "}
        <b>future 5-year predictions</b>.
      </div>

      {/*  TIME HUD */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,

          background: "rgba(10,26,20,0.6)",
          backdropFilter: "blur(14px)",

          border: "1px solid rgba(168,230,207,0.4)",
          boxShadow: "0 0 20px rgba(168,230,207,0.15)",

          padding: "14px 22px",
          borderRadius: "14px",

          display: "flex",
          alignItems: "center",
          gap: "16px",

          color: "#A8E6CF",
          fontFamily: "monospace"
        }}
      >
        <div style={{ opacity: 0.7 }}>TIME</div>

        <div style={{ fontSize: "16px", fontWeight: "bold" }}>
          {timeIndex}
        </div>

        <input
          type="range"
          min="1980"
          max="2031"
          value={timeIndex}
          onChange={handleYearChange}
          style={{
            width: "220px",
            appearance: "none",
            background: "rgba(168,230,207,0.2)",
            height: "2px",
            borderRadius: "10px"
          }}
        />

        <div style={{ opacity: 0.6, fontSize: "12px" }}>
          historical → prediction
        </div>
      </div>

      {/*  GLOBE */}
      <Globe
        ref={globeEl}
        width={window.innerWidth}
        height={window.innerHeight}

        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundColor="#0A1A14"

        globeMaterial={new THREE.MeshPhongMaterial({
          color: "#0A1A14"
        })}

        polygonsData={countries}
        polygonCapColor={() => "rgba(168,230,207,0.25)"}
        polygonStrokeColor={() => "#7FE9C3"}
        polygonAltitude={0.01}

        onPolygonClick={(d) => {
          const idToCode = {
            40: "AT",
            276: "DE",
            826: "GB",
            840: "US",
            124: "CA",
            56: "BE",
            768: "TG",
            246: "FI",
            36: "AU"
          };

          const code = idToCode[d.id];

          if (code) {
            setSelectedCountry({ country: code });
          }
        }}

        htmlElementsData={highlightMarkers}
        htmlLat="lat"
        htmlLng="lng"

        htmlElement={(d) => {
          const el = document.createElement("div");

          const pulse = Math.sin(Date.now() * 0.002) * 0.5 + 0.5;

          const size = 7 + pulse * 3;

          el.style.width = `${size}px`;
          el.style.height = `${size}px`;

          el.style.borderRadius = "50%";
          el.style.background = `rgba(168,230,207,${0.5 + pulse * 0.3})`;

          el.style.boxShadow = "0 0 14px rgba(168,230,207,0.8)";
          el.style.transform = "translate(-50%, -50%)";

          el.style.position = "absolute";
          el.style.cursor = "pointer";
          el.style.pointerEvents = "auto";
          el.style.zIndex = "9999";

          el.onclick = (e) => {
            e.stopPropagation();

            setSelectedCountry({
              country: d.country
            });
          };

          return el;
        }}
      />
    </div>
  );
};

export default GlobeView;