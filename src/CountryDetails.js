import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Wind, Cloud, Thermometer, Droplets, FlaskConical } from 'lucide-react';
import { useState, useEffect } from 'react';
import './index.css';
import tacLogo from './assets/tac logo.png';

import AT from './data/AT.json';
import DE from './data/DE.json';
import GB from './data/GB.json';
import US from './data/US.json';
import TG from './data/TG.json';
import CA from './data/CA.json';

const kitData = { AT, DE, GB, US, TG, CA };

const DataRow = ({ label, value, unit }) => (
  <div style={{ marginBottom: '15px' }}>
    <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 5px 0' }}>{label}</p>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <h2 style={{ margin: 0 }}>{value}<span style={{ fontSize: '14px', color: '#94a3b8' }}>{unit}</span></h2>
      <div style={{ width: '100px', height: '4px', background: '#f1f5f9', borderRadius: '2px' }}>
        <div style={{ width: '40%', height: '100%', background: '#059669', borderRadius: '2px' }} />
      </div>
    </div>
  </div>
);

export default function CountryDetails() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  const countryCode = code ? code.toUpperCase() : 'AT';
  const data = kitData[countryCode];

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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

  const formatTime = (date) => date.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });

  const getTimezone = (date) => {
    const offset = -date.getTimezoneOffset() / 60;
    return `GMT${offset >= 0 ? '+' : ''}${offset}`;
  };

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

  const atmosphericSensors = data.sensors.filter(k =>
    ['ftTemp', 'ftHumidity', 'ftPressure'].includes(k)
  );
  const gasSensors = data.sensors.filter(k =>
    !['ftTemp', 'ftHumidity', 'ftPressure'].includes(k)
  );
  const hasGas = Object.keys(data.gas_concentration || {}).length > 0 || gasSensors.length > 0;

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
          {data.location}<br />Details
        </h1>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '30px' }}>
          <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>● LIVE STREAMING</span>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Kit ID: {data.kit_id}</span>
        </div>

        {/* LIVE WEATHER */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '25px' }}>
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
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px', marginBottom: '25px', border: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>KIT NAME</p>
          <h2 style={{ margin: '5px 0' }}>{data.name}</h2>
          <p style={{ fontSize: '10px', color: '#059669', margin: 0 }}>🛡️ STATUS: {data.status.toUpperCase()}</p>
        </div>

        {/* LAST SYNC */}
        <div style={{ marginBottom: '25px' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>LAST SYNC</p>
          <h2 style={{ margin: '5px 0' }}>
            {formatTime(time)}{' '}
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{getTimezone(time)}</span>
          </h2>
          <p style={{ fontSize: '12px', color: '#059669', margin: 0 }}>{data.last_sync}</p>
        </div>

        {/* ATMOSPHERIC DATA */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Atmospheric Data</h3>
            <Wind size={20} color="#059669" />
          </div>
          {atmosphericSensors.length > 0 ? (
            atmosphericSensors.map(sensorKey => {
              const sensor = data.live[sensorKey];
              if (!sensor) return null;
              return (
                <DataRow
                  key={sensorKey}
                  label={sensor.label.toUpperCase()}
                  value={sensor.value}
                  unit={sensor.unit}
                />
              );
            })
          ) : (
            data.sensors.map(sensorKey => {
              const sensor = data.live[sensorKey];
              if (!sensor) return null;
              return (
                <DataRow
                  key={sensorKey}
                  label={sensor.label.toUpperCase()}
                  value={sensor.value}
                  unit={sensor.unit}
                />
              );
            })
          )}
        </div>

        {/* GAS CONCENTRATION */}
        {hasGas && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Trace Gas</h3>
              <FlaskConical size={20} color="#059669" />
            </div>
            {gasSensors.length > 0 ? (
              gasSensors.map(sensorKey => {
                const sensor = data.live[sensorKey];
                if (!sensor) return null;
                return (
                  <DataRow
                    key={sensorKey}
                    label={sensor.label.toUpperCase()}
                    value={sensor.value}
                    unit={sensor.unit}
                  />
                );
              })
            ) : (
              Object.entries(data.gas_concentration).map(([key, gas]) => (
                <DataRow
                  key={key}
                  label={key.toUpperCase()}
                  value={gas.value}
                  unit={gas.unit || 'ppm'}
                />
              ))
            )}
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '10px 0 0 0' }}>PPM LEVELS</p>
          </div>
        )}
      </div>
    </div>
  );
}