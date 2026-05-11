import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Cloud, Thermometer, Droplets, Wind } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Annotation } from 'react-simple-maps';
import './index.css';
import tacLogo from './assets/tac logo.png';

import AT from './data/AT.json';
import DE from './data/DE.json';
import GB from './data/GB.json';
import US from './data/US.json';
import TG from './data/TG.json';
import CA from './data/CA.json';

const kitData = { AT, DE, GB, US, TG, CA };

const countryNumericMap = {
  AT: "040", DE: "276", GB: "826", US: "840", TG: "768", CA: "124"
};

const scaleMap = {
  AT: 4200, DE: 2700, GB: 2400, US: 570, TG: 6000, CA: 390
};

const centerMap = {
  AT: [13.5, 47.5],
  DE: [10.0, 51.0],
  GB: [-2.0, 54.0],
  US: [-98.0, 39.0],
  TG: [1.0, 8.5],
  CA: [-96.0, 60.0],
};

const cityMarkers = {
  AT: [
    { name: "Salzburg, AT", lat: 47.8, lon: 13.04, dx: -60, dy: -40 },
    { name: "Vienna, AT", lat: 48.2, lon: 16.37, dx: 40, dy: -50 },
    { name: "Linz (AT)", lat: 48.3, lon: 14.29, dx: 30, dy: 40 },
  ],
  DE: [
    { name: "Berlin, DE", lat: 52.52, lon: 13.4, dx: 40, dy: -40 },
    { name: "Munich, DE", lat: 48.14, lon: 11.58, dx: -60, dy: 40 },
    { name: "Hamburg, DE", lat: 53.55, lon: 9.99, dx: -60, dy: -40 },
  ],
  GB: [
    { name: "London, GB", lat: 51.51, lon: -0.13, dx: 40, dy: 40 },
    { name: "Manchester, GB", lat: 53.48, lon: -2.24, dx: -60, dy: -20 },
    { name: "Edinburgh, GB", lat: 55.95, lon: -3.19, dx: -60, dy: -40 },
  ],
  US: [
    { name: "New York, US", lat: 40.71, lon: -74.0, dx: 40, dy: -40 },
    { name: "Los Angeles, US", lat: 34.05, lon: -118.24, dx: -60, dy: 40 },
    { name: "Chicago, US", lat: 41.88, lon: -87.63, dx: 40, dy: 40 },
  ],
  TG: [
    { name: "Lomé, TG", lat: 6.14, lon: 1.22, dx: 40, dy: 40 },
    { name: "Sokodé, TG", lat: 8.98, lon: 1.14, dx: 40, dy: -40 },
  ],
  CA: [
    { name: "Toronto, CA", lat: 43.65, lon: -79.38, dx: 40, dy: -40 },
    { name: "Vancouver, CA", lat: 49.28, lon: -123.12, dx: -60, dy: -40 },
    { name: "Montreal, CA", lat: 45.5, lon: -73.57, dx: 40, dy: 40 },
  ],
};

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function CountryRawData() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  const countryCode = code ? code.toUpperCase() : 'AT';
  const data = kitData[countryCode];

  useEffect(() => {
    if (!data) return;
    setWeatherLoading(true);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${data.lat}&longitude=${data.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&wind_speed_unit=mph`
    )
      .then(res => res.json())
      .then(json => {
        setWeather(json.current);
        setWeatherLoading(false);
      })
      .catch(() => setWeatherLoading(false));
  }, [countryCode]);

  const getWeatherLabel = (code) => {
    if (code === 0) return 'Clear sky';
    if (code <= 3) return 'Partly cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 82) return 'Showers';
    return 'Stormy';
  };

  if (!data) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Data Not Found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="app-container overflow-y">
      <header className="header" style={{ justifyContent: 'space-between', position: 'relative' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          aria-label="Go back"
        >
          <ChevronLeft size={24} color="#059669" />
        </button>
        <img
          src={tacLogo}
          alt="TeleAgriCulture"
          style={{ height: '50px', objectFit: 'contain', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
        />
      </header>

      <div style={{ padding: '0 2rem' }}>
        <h1 style={{ fontSize: '42px', margin: '10px 0', lineHeight: '1.1' }}>
          {data.location}<br />Raw Data
        </h1>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '30px' }}>
          <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>● LIVE STREAMING</span>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Kit ID: {data.kit_id}</span>
        </div>

        {/* MAP */}
        <div style={{ borderRadius: '15px', overflow: 'hidden', marginBottom: '10px', height: '260px', background: '#f0faf5', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: centerMap[countryCode] || [data.lon, data.lat], scale: scaleMap[countryCode] || 800 }}
            style={{ width: '100%', height: '100%' }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const isTarget = geo.id === countryNumericMap[countryCode];
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isTarget ? '#a8d5b5' : 'transparent'}
                      stroke={isTarget ? '#6ab88a' : 'transparent'}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none' },
                        pressed: { outline: 'none' }
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {(cityMarkers[countryCode] || []).map(city => (
              <Annotation
                key={city.name}
                subject={[city.lon, city.lat]}
                dx={city.dx}
                dy={city.dy}
                connectorProps={{ stroke: '#059669', strokeWidth: 1 }}
              >
                <foreignObject
                  x={city.dx > 0 ? 0 : -220}
                  y={-26}
                  width={220}
                  height={60}
                >
                  <div style={{
                    background: 'white',
                    borderRadius: '10px',
                    padding: '6px 12px',
                    fontSize: '22px',
                    fontWeight: '500',
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    whiteSpace: 'nowrap'
                  }}>
                    <span style={{ color: '#059669', fontSize: '22px' }}>●</span>
                    {city.name}
                  </div>
                </foreignObject>
              </Annotation>
            ))}
          </ComposableMap>
        </div>

        {/* LIVE WEATHER */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Live Weather</h3>
            <Cloud size={20} color="#059669" />
          </div>
          {weatherLoading ? (
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Fetching weather...</p>
          ) : weather ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 4px 0' }}>TEMPERATURE</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Thermometer size={16} color="#059669" />
                  <h3 style={{ margin: 0 }}>{weather.temperature_2m}°C</h3>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 4px 0' }}>HUMIDITY</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Droplets size={16} color="#059669" />
                  <h3 style={{ margin: 0 }}>{weather.relative_humidity_2m}%</h3>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 4px 0' }}>WIND SPEED</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wind size={16} color="#059669" />
                  <h3 style={{ margin: 0 }}>{weather.wind_speed_10m} mph</h3>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 4px 0' }}>CONDITIONS</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cloud size={16} color="#059669" />
                  <h3 style={{ margin: 0, fontSize: '14px' }}>{getWeatherLabel(weather.weather_code)}</h3>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>Weather unavailable</p>
          )}
        </div>

        {/* KIT INFO */}
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>KIT NAME</p>
              <h2 style={{ margin: '5px 0' }}>{data.name}</h2>
            </div>
            <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
              {data.status.toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize: '10px', color: '#059669', margin: '10px 0 0 0' }}>🛡️ Last sync: {data.last_sync}</p>
        </div>

        {/* BUTTONS */}
        <button
          onClick={() => navigate(`/country/${countryCode}/details`)}
          style={{
            width: '100%',
            padding: '16px',
            background: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            marginBottom: '12px',
            textTransform: 'uppercase'
          }}
        >
          Details
        </button>

        <button
          onClick={() => navigate(`/country/${countryCode}/dashboard`)}
          style={{
            width: '100%',
            padding: '16px',
            background: '#047857',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            marginBottom: '30px',
            textTransform: 'uppercase'
          }}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}