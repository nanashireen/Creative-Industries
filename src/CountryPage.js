import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Cloud, Thermometer, Droplets, Wind, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Annotation } from 'react-simple-maps';
import { useTheme } from './ThemeContext';
import { useYear } from './YearContext';
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

export default function CountryRawData() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { isLight, toggle } = useTheme();
  const { selectedYear } = useYear();
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [drought, setDrought] = useState(null);

  const countryCode = code ? code.toUpperCase() : 'AT';
  const data = kitData[countryCode];

  // colours
  const BG = isLight
    ? 'linear-gradient(160deg, #f0faf5 0%, #e6f5ec 50%, #f0faf5 100%)'
    : 'linear-gradient(160deg, #1a2e22 0%, #22382a 50%, #1a2e22 100%)';
  const GREEN = '#38bc78';
  const GREEN_DIM = isLight ? 'rgba(4,120,87,0.6)' : 'rgba(56,188,120,0.5)';
  const GREEN_FAINT = isLight ? 'rgba(4,120,87,0.08)' : 'rgba(56,188,120,0.12)';
  const TEXT = isLight ? '#1a2e22' : 'white';
  const TEXT_DIM = isLight ? 'rgba(26,46,34,0.5)' : 'rgba(56,188,120,0.5)';
  const CARD = {
    background: isLight ? 'white' : 'rgba(255,255,255,0.08)',
    border: isLight ? '1px solid rgba(4,120,87,0.15)' : '1px solid rgba(56,188,120,0.2)',
    borderRadius: '15px', padding: '20px', marginBottom: '20px',
    boxShadow: isLight ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
  };
  const MAP_BG = isLight ? 'rgba(4,120,87,0.06)' : 'rgba(56,188,120,0.05)';
  const MAP_FILL = isLight ? '#6ab88a' : '#2d6a4f';
  const MAP_STROKE = isLight ? '#38bc78' : '#a8e6cf';
  const LABEL_BG = isLight ? 'white' : 'rgba(26,46,34,0.95)';
  const LABEL_COLOR = isLight ? '#1a2e22' : '#a8e6cf';

  useEffect(() => {
    if (!data) return;
    setWeatherLoading(true);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${data.lat}&longitude=${data.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&wind_speed_unit=mph`)
      .then(res => res.json())
      .then(json => { setWeather(json.current); setWeatherLoading(false); })
      .catch(() => setWeatherLoading(false));
  }, [countryCode]);

  useEffect(() => {
    if (!data || countryCode !== 'TG') {
      setDrought(null);
      return;
    }

    const archiveStart = 2020;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const currentYear = yesterday.getFullYear();

    const year = selectedYear || currentYear;

    // year out of archive range
    if (year < archiveStart || year > currentYear) {
      setDrought({ unavailable: true, year });
      return;
    }

    const startDate = `${year}-01-01`;
    const endDate = year === currentYear
      ? yesterday.toISOString().split('T')[0]
      : `${year}-12-31`;

    // need at least 30 days of data
    const start = new Date(startDate);
    const end = new Date(endDate);
    if ((end - start) / (1000 * 60 * 60 * 24) < 30) {
      setDrought({ unavailable: true, year, reason: 'insufficient' });
      return;
    }

    // fetch 45 days before startDate for rolling window warmup
    const warmupStart = new Date(start);
    warmupStart.setDate(warmupStart.getDate() - 45);
    const fmt = d => d.toISOString().split('T')[0];

    fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${data.lat}&longitude=${data.lon}&daily=temperature_2m_max,precipitation_sum,et0_fao_evapotranspiration&start_date=${fmt(warmupStart)}&end_date=${endDate}&timezone=auto`)
      .then(res => res.json())
      .then(json => {
        const d = json.daily;
        if (!d || !d.time || d.time.length < 30) {
          setDrought({ unavailable: true, year });
          return;
        }
        const len = d.time.length;
        const last30Precip = d.precipitation_sum.slice(-30);
        const last14Precip = d.precipitation_sum.slice(-14);
        const last14Evap = d.et0_fao_evapotranspiration.slice(-14);
        const avg = arr => arr.reduce((a, b) => a + (b || 0), 0) / arr.length;
        const precip30 = avg(last30Precip);
        const evap14 = avg(last14Evap);
        const tempMax = d.temperature_2m_max[len - 1];
        let score = 0;
        if (precip30 < 0.3) score += 40;
        else if (precip30 < 0.8) score += 25;
        else if (precip30 < 1.5) score += 10;
        if (evap14 > 6) score += 25;
        else if (evap14 > 4) score += 12;
        if (tempMax > 38) score += 20;
        else if (tempMax > 34) score += 10;
        else if (tempMax > 30) score += 5;
        score = Math.min(100, score);
        setDrought({ score, precip30: precip30.toFixed(2), evap14: evap14.toFixed(2), tempMax, trend: last30Precip, year });
      })
      .catch(() => setDrought({ unavailable: true, year }));
  }, [countryCode, selectedYear]);

  const getWeatherLabel = (code) => {
    if (code === 0) return 'Clear sky';
    if (code <= 3) return 'Partly cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 82) return 'Showers';
    return 'Stormy';
  };

  const getDroughtLabel = (score) => {
    if (score >= 60) return { label: 'HIGH RISK', color: '#ef4444' };
    if (score >= 35) return { label: 'MODERATE', color: '#f59e0b' };
    return { label: 'LOW RISK', color: GREEN };
  };

  if (!data) return (
    <div style={{ padding: '50px', textAlign: 'center', background: '#1a2e22', minHeight: '100vh', color: 'white' }}>
      <h2>Data Not Found</h2>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', position: 'relative', borderBottom: `1px solid ${GREEN_FAINT}` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <ChevronLeft size={24} color={GREEN} />
        </button>
        <img src={tacLogo} alt="TeleAgriCulture" style={{ height: '50px', objectFit: 'contain', position: 'absolute', left: '50%', transform: 'translateX(-50%)', filter: isLight ? 'none' : 'none' }} />
        <button onClick={toggle} style={{ background: GREEN_FAINT, border: `1px solid ${GREEN_DIM}`, borderRadius: '20px', padding: '6px 14px', cursor: 'pointer', fontSize: '12px', color: GREEN, fontWeight: 'bold', fontFamily: "'Inter', sans-serif" }}>
          {isLight ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      <div style={{ padding: '0 2rem' }}>
        <h1 style={{ fontSize: '42px', margin: '20px 0 8px 0', lineHeight: '1.1', fontFamily: 'monospace', color: TEXT, fontWeight: '700' }}>
          {data.location}<br />Overview
        </h1>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ background: GREEN_FAINT, color: GREEN, padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: `1px solid ${GREEN_DIM}` }}>● LIVE STREAMING</span>
          <span style={{ color: TEXT_DIM, fontSize: '13px' }}>Kit ID: {data.kit_id}</span>
        </div>

        {/* MAP */}
        <div style={{ borderRadius: '15px', overflow: 'hidden', marginBottom: '20px', height: '260px', background: MAP_BG, border: `1px solid ${GREEN_FAINT}`, position: 'relative' }}>
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
                      fill={isTarget ? MAP_FILL : 'transparent'}
                      stroke={isTarget ? MAP_STROKE : 'transparent'}
                      style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
                    />
                  );
                })
              }
            </Geographies>
            {(cityMarkers[countryCode] || []).map(city => (
              <Annotation key={city.name} subject={[city.lon, city.lat]} dx={city.dx} dy={city.dy} connectorProps={{ stroke: GREEN, strokeWidth: 1 }}>
                <foreignObject x={city.dx > 0 ? 0 : -280} y={-34} width={280} height={65}>
                  <div style={{ background: LABEL_BG, border: `1px solid ${GREEN_DIM}`, borderRadius: '10px', padding: '7px 13px', fontSize: '19px', fontWeight: '600', fontFamily: "'Inter', sans-serif", color: LABEL_COLOR, display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                    <span style={{ color: GREEN, fontSize: '19px' }}>●</span>
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
            <h3 style={{ margin: 0, color: TEXT, fontSize: '18px' }}>Live Weather</h3>
            <Cloud size={20} color={GREEN} />
          </div>
          {weatherLoading ? (
            <p style={{ color: TEXT_DIM, fontSize: '15px', margin: 0 }}>Fetching weather...</p>
          ) : weather ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {[
                { label: 'TEMPERATURE', icon: <Thermometer size={18} color={GREEN} />, value: `${weather.temperature_2m}°C` },
                { label: 'HUMIDITY', icon: <Droplets size={18} color={GREEN} />, value: `${weather.relative_humidity_2m}%` },
                { label: 'WIND SPEED', icon: <Wind size={18} color={GREEN} />, value: `${weather.wind_speed_10m} mph` },
                { label: 'CONDITIONS', icon: <Cloud size={18} color={GREEN} />, value: getWeatherLabel(weather.weather_code) },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ fontSize: '11px', color: TEXT_DIM, margin: '0 0 4px 0', letterSpacing: '0.05em' }}>{item.label}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.icon}
                    <h3 style={{ margin: 0, color: TEXT, fontSize: '18px' }}>{item.value}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#ef4444', fontSize: '15px', margin: 0 }}>Weather unavailable</p>
          )}
        </div>

        {/* DROUGHT PREDICTION */}
        {drought && (() => {
          if (drought.unavailable) {
            return (
              <div style={CARD}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: TEXT, fontSize: '18px' }}>Drought Risk ({drought.year})</h3>
                  <span style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', border: '1px solid rgba(239,68,68,0.35)' }}>UNAVAILABLE</span>
                </div>
                <p style={{ fontSize: '13px', color: TEXT_DIM, margin: 0 }}>
                  {drought.reason === 'insufficient' ? 'Insufficient historical data for this period.' : 'Data out of historical archive range (2020-present).'}
                </p>
              </div>
            );
          }
          const { label, color } = getDroughtLabel(drought.score);
          return (
            <div style={CARD}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: TEXT, fontSize: '18px' }}>Drought Risk</h3>
                <span style={{ background: `${color}22`, color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', border: `1px solid ${color}66` }}>{label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ position: 'relative', width: '70px', height: '70px' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '70px', height: '70px', transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={isLight ? '#e5e7eb' : 'rgba(255,255,255,0.1)'} strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
                      strokeDasharray={`${drought.score} ${100 - drought.score}`} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '14px', fontWeight: 'bold', color, fontFamily: 'monospace' }}>{drought.score}</div>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: TEXT_DIM, margin: '0 0 4px 0', letterSpacing: '0.05em' }}>SCORE / 100</p>
                  <p style={{ fontSize: '13px', color: TEXT_DIM, margin: '0 0 4px 0' }}>30d avg precip: <b style={{ color: TEXT }}>{drought.precip30} mm/day</b></p>
                  <p style={{ fontSize: '13px', color: TEXT_DIM, margin: 0 }}>14d avg evap: <b style={{ color: TEXT }}>{drought.evap14} mm/day</b></p>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: TEXT_DIM, margin: '0 0 6px 0', letterSpacing: '0.05em' }}>30-DAY PRECIPITATION TREND (mm)</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '50px' }}>
                {drought.trend.map((val, i) => {
                  const max = Math.max(...drought.trend, 1);
                  const pct = Math.max(4, ((val || 0) / max) * 100);
                  return <div key={i} style={{ flex: 1, height: `${pct}%`, background: val > 5 ? GREEN : val > 1 ? '#f59e0b' : '#ef4444', borderRadius: '2px 2px 0 0', opacity: 0.8 }} />;
                })}
              </div>
            </div>
          );
        })()}

        {/* KIT INFO */}
        <div style={CARD}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '11px', color: TEXT_DIM, margin: 0, letterSpacing: '0.05em' }}>KIT NAME</p>
              <h2 style={{ margin: '5px 0', color: TEXT, fontSize: '24px', fontFamily: 'monospace' }}>{data.name}</h2>
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
          style={{ width: '100%', padding: '16px', background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)', color: GREEN, border: `1px solid ${GREEN_DIM}`, borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.08em', cursor: 'pointer', marginBottom: '30px', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
          Dashboard
        </button>
      </div>
    </div>
  );
}