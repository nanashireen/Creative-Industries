import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Cloud, Thermometer, Droplets, Wind } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Annotation } from 'react-simple-maps';
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
  AT: [13.5, 47.5], DE: [10.0, 51.0], GB: [-2.0, 54.0],
  US: [-98.0, 39.0], TG: [1.0, 8.5], CA: [-96.0, 60.0],
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

const BG = 'linear-gradient(160deg, #1a2e22 0%, #22382a 50%, #1a2e22 100%)';
const CARD = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(56,188,120,0.2)', borderRadius: '15px', padding: '20px', marginBottom: '20px' };
const GREEN = '#38bc78';
const GREEN_DIM = 'rgba(56,188,120,0.5)';
const GREEN_FAINT = 'rgba(56,188,120,0.12)';

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
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${data.lat}&longitude=${data.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&wind_speed_unit=mph`)
      .then(res => res.json())
      .then(json => { setWeather(json.current); setWeatherLoading(false); })
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

  if (!data) return (
    <div style={{ padding: '50px', textAlign: 'center', background: '#1a2e22', minHeight: '100vh', color: 'white' }}>
      <h2>Data Not Found</h2>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', position: 'relative', borderBottom: '1px solid rgba(56,188,120,0.15)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <ChevronLeft size={24} color={GREEN} />
        </button>
        <img src={tacLogo} alt="TeleAgriCulture" style={{ height: '50px', objectFit: 'contain', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} />
      </header>

      <div style={{ padding: '0 2rem' }}>
        <h1 style={{ fontSize: '42px', margin: '20px 0 8px 0', lineHeight: '1.1', color: 'white', fontWeight: '400', fontFamily: "monospace" }}>
          {data.location}<br />Overview
        </h1>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ background: GREEN_FAINT, color: GREEN, padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: `1px solid ${GREEN_DIM}` }}>● LIVE STREAMING</span>
          <span style={{ color: GREEN_DIM, fontSize: '13px' }}>Kit ID: {data.kit_id}</span>
        </div>

        {/* MAP */}
        <div style={{ borderRadius: '15px', overflow: 'hidden', marginBottom: '20px', height: '260px', background: GREEN_FAINT, border: '1px solid rgba(56,188,120,0.2)', position: 'relative' }}>
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
                    <Geography key={geo.rsmKey} geography={geo}
                      fill={isTarget ? '#2d6a4f' : 'transparent'}
                      stroke={isTarget ? GREEN : 'transparent'}
                      style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
                    />
                  );
                })
              }
            </Geographies>
            {(cityMarkers[countryCode] || []).map(city => (
              <Annotation key={city.name} subject={[city.lon, city.lat]} dx={city.dx} dy={city.dy} connectorProps={{ stroke: GREEN, strokeWidth: 1 }}>
                <foreignObject x={city.dx > 0 ? 0 : -280} y={-34} width={280} height={70}>
                  <div style={{ background: 'rgba(26,46,34,0.95)', border: `1px solid ${GREEN_DIM}`, borderRadius: '10px', padding: '8px 14px', fontSize: '20px', fontWeight: '600', fontFamily: "'Inter', sans-serif", color: 'white', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                    <span style={{ color: GREEN, fontSize: '20px' }}>●</span>
                    {city.name}
                  </div>
                </foreignObject>
              </Annotation>
            ))}
          </ComposableMap>
        </div>

        {/* LIVE WEATHER */}
        <div style={CARD}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>Live Weather</h3>
            <Cloud size={20} color={GREEN} />
          </div>
          {weatherLoading ? (
            <p style={{ color: GREEN_DIM, fontSize: '15px', margin: 0 }}>Fetching weather...</p>
          ) : weather ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {[
                { label: 'TEMPERATURE', icon: <Thermometer size={18} color={GREEN} />, value: `${weather.temperature_2m}°C` },
                { label: 'HUMIDITY', icon: <Droplets size={18} color={GREEN} />, value: `${weather.relative_humidity_2m}%` },
                { label: 'WIND SPEED', icon: <Wind size={18} color={GREEN} />, value: `${weather.wind_speed_10m} mph` },
                { label: 'CONDITIONS', icon: <Cloud size={18} color={GREEN} />, value: getWeatherLabel(weather.weather_code) },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ fontSize: '11px', color: GREEN_DIM, margin: '0 0 4px 0', letterSpacing: '0.05em' }}>{item.label}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.icon}
                    <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>{item.value}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#ef4444', fontSize: '15px', margin: 0 }}>Weather unavailable</p>
          )}
        </div>

        {/* KIT INFO */}
        <div style={CARD}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '11px', color: GREEN_DIM, margin: 0, letterSpacing: '0.05em' }}>KIT NAME</p>
              <h2 style={{ margin: '5px 0', color: 'white', fontSize: '24px' }}>{data.name}</h2>
            </div>
            <span style={{ background: GREEN_FAINT, color: GREEN, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: `1px solid ${GREEN_DIM}` }}>
              {data.status.toUpperCase()}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: GREEN, margin: '10px 0 0 0' }}>🛡️ Last sync: {data.last_sync}</p>
        </div>

        {/* BUTTONS */}
        <button onClick={() => navigate(`/country/${countryCode}/details`)}
          style={{ width: '100%', padding: '16px', background: GREEN, color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.08em', cursor: 'pointer', marginBottom: '12px', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif", boxShadow: `0 0 20px ${GREEN_FAINT}` }}>
          Details
        </button>

        <button onClick={() => navigate(`/country/${countryCode}/dashboard`)}
          style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.07)', color: GREEN, border: `1px solid ${GREEN_DIM}`, borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.08em', cursor: 'pointer', marginBottom: '30px', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
          Dashboard
        </button>
      </div>
    </div>
  );
}