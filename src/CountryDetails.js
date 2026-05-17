import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Wind, Cloud, Thermometer, Droplets, FlaskConical } from 'lucide-react';
import { useState, useEffect } from 'react';
import tacLogo from './assets/tac logo.png';

import AT from './data/AT.json';
import DE from './data/DE.json';
import GB from './data/GB.json';
import US from './data/US.json';
import TG from './data/TG.json';
import CA from './data/CA.json';

const kitData = { AT, DE, GB, US, TG, CA };

const BG = 'linear-gradient(160deg, #1a2e22 0%, #22382a 50%, #1a2e22 100%)';
const CARD = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(56,188,120,0.2)', borderRadius: '15px', padding: '20px', marginBottom: '20px' };
const GREEN = '#38bc78';
const GREEN_DIM = 'rgba(56,188,120,0.5)';

const DataRow = ({ label, value, unit }) => (
  <div style={{ marginBottom: '18px' }}>
    <p style={{ fontSize: '11px', color: GREEN_DIM, margin: '0 0 6px 0', letterSpacing: '0.05em' }}>{label}</p>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <h2 style={{ margin: 0, color: 'white', fontSize: '28px' }}>{value}<span style={{ fontSize: '16px', color: GREEN_DIM, fontFamily: "'Inter', sans-serif" }}>{unit}</span></h2>
      <div style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
        <div style={{ width: '40%', height: '100%', background: GREEN, borderRadius: '2px' }} />
      </div>
    </div>
  </div>
);

export default function CountryDetails() {
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
      <h2>Data Not Found</h2><button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  const atmosphericSensors = data.sensors.filter(k => ['ftTemp', 'ftHumidity', 'ftPressure'].includes(k));
  const gasSensors = data.sensors.filter(k => !['ftTemp', 'ftHumidity', 'ftPressure'].includes(k));
  const hasGas = Object.keys(data.gas_concentration || {}).length > 0 || gasSensors.length > 0;

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
          {data.location}<br />Details
        </h1>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ background: 'rgba(56,188,120,0.12)', color: GREEN, padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: `1px solid ${GREEN_DIM}` }}>● LIVE STREAMING</span>
          <span style={{ color: GREEN_DIM, fontSize: '13px' }}>Kit ID: {data.kit_id}</span>
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
          <p style={{ fontSize: '11px', color: GREEN_DIM, margin: 0, letterSpacing: '0.05em' }}>KIT NAME</p>
          <h2 style={{ margin: '5px 0', color: 'white', fontSize: '24px' }}>{data.name}</h2>
          <p style={{ fontSize: '13px', color: GREEN, margin: 0 }}>🛡️ STATUS: {data.status.toUpperCase()}</p>
        </div>

        {/* LAST SYNC */}
        <div style={{ marginBottom: '25px' }}>
          <p style={{ fontSize: '11px', color: GREEN_DIM, margin: 0, letterSpacing: '0.05em' }}>LAST SYNC</p>
          <h2 style={{ margin: '5px 0', color: 'white', fontSize: '24px' }}>{data.last_sync}</h2>
          <p style={{ fontSize: '13px', color: GREEN, margin: 0 }}>
            {data.scraped_at ? new Date(data.scraped_at).toLocaleString('en-GB') : ''}
          </p>
        </div>

        {/* ATMOSPHERIC DATA */}
        <div style={CARD}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>Atmospheric Data</h3>
            <Wind size={20} color={GREEN} />
          </div>
          {(atmosphericSensors.length > 0 ? atmosphericSensors : data.sensors).map(sensorKey => {
            const sensor = data.live[sensorKey];
            if (!sensor) return null;
            return <DataRow key={sensorKey} label={sensor.label.toUpperCase()} value={sensor.value} unit={sensor.unit} />;
          })}
        </div>

        {/* GAS CONCENTRATION */}
        {hasGas && (
          <div style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>Trace Gas</h3>
              <FlaskConical size={20} color={GREEN} />
            </div>
            {gasSensors.length > 0 ? (
              gasSensors.map(sensorKey => {
                const sensor = data.live[sensorKey];
                if (!sensor) return null;
                return <DataRow key={sensorKey} label={sensor.label.toUpperCase()} value={sensor.value} unit={sensor.unit} />;
              })
            ) : (
              Object.entries(data.gas_concentration).map(([key, gas]) => (
                <DataRow key={key} label={key.toUpperCase()} value={gas.value} unit={gas.unit || 'ppm'} />
              ))
            )}
            <p style={{ fontSize: '12px', color: GREEN_DIM, margin: '10px 0 0 0', letterSpacing: '0.05em' }}>PPM LEVELS</p>
          </div>
        )}
      </div>
    </div>
  );
}