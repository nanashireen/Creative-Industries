import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, BarChart2, Droplets, FlaskConical } from 'lucide-react';
import './index.css';
import tacLogo from './assets/tac logo.png';

import AT from './data/AT.json';
import DE from './data/DE.json';
import GB from './data/GB.json';
import US from './data/US.json';
import TG from './data/TG.json';
import CA from './data/CA.json';

const kitData = { AT, DE, GB, US, TG, CA };

export default function CountryDashboard() {
  const { code } = useParams();
  const navigate = useNavigate();

  const countryCode = code ? code.toUpperCase() : 'AT';
  const data = kitData[countryCode];

  if (!data) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Data Not Found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const gasEntries = Object.entries(data.gas_concentration || {});

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
          {data.location}<br />Dashboard
        </h1>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '30px' }}>
          <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>● LIVE</span>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Kit ID: {data.kit_id}</span>
        </div>

        {/* EFFICIENCY TREND */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Efficiency Trend</h3>
            <BarChart2 size={20} color="#059669" />
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 15px 0' }}>System performance over 24H</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '80px' }}>
            {data.efficiency_trend.map((point, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${point.efficiency_pct}%`,
                  background: point.efficiency_pct > 80 ? '#059669' : point.efficiency_pct > 50 ? '#f59e0b' : '#ef4444',
                  borderRadius: '3px 3px 0 0',
                  minHeight: '4px'
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>00:00</span>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>12:00</span>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>23:00</span>
          </div>
          <p style={{ fontSize: '13px', color: '#059669', fontWeight: 'bold', margin: '10px 0 0 0' }}>
            Avg: {data.efficiency_avg}%
          </p>
        </div>

        {/* SENSOR ANALYTICS */}
        {data.sensors.map(sensorKey => {
          const analytics = data.analytics[sensorKey];
          if (!analytics) return null;
          return (
            <div key={sensorKey} style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0 }}>{analytics.label}</h3>
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                  {analytics.state.toUpperCase()}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 15px 0' }}>{analytics.description}</p>
              <h2 style={{ margin: '0 0 5px 0' }}>{analytics.value}<span style={{ fontSize: '14px', color: '#94a3b8' }}>{analytics.unit}</span></h2>
              <div style={{ display: 'flex', gap: '15px', fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>
                <span>MIN: <b style={{ color: '#1e293b' }}>{analytics.min_24h}{analytics.unit}</b></span>
                <span>AVG: <b style={{ color: '#1e293b' }}>{analytics.mean_24h}{analytics.unit}</b></span>
                <span>MAX: <b style={{ color: '#1e293b' }}>{analytics.max_24h}{analytics.unit}</b></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '50px', marginTop: '15px' }}>
                {analytics.trend.filter((_, i) => i % 3 === 0).map((point, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${Math.max(10, ((point.value - analytics.min_24h) / ((analytics.max_24h - analytics.min_24h) || 1)) * 100)}%`,
                      background: '#059669',
                      borderRadius: '2px 2px 0 0',
                      opacity: 0.7
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* RELATIVE AIR MOISTURE */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Relative Air Moisture</h3>
            <Droplets size={20} color="#059669" />
          </div>
          {data.sensors.map(sensorKey => {
            const sensor = data.live[sensorKey];
            if (!sensor || !['ftHumidity', 'ftTemp'].includes(sensorKey)) return null;
            const analytics = data.analytics[sensorKey];
            return (
              <div key={sensorKey} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>{sensor.label.toUpperCase()}</p>
                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>
                    24H AVG: <b style={{ color: '#1e293b' }}>{analytics?.mean_24h}{sensor.unit}</b>
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <h2 style={{ margin: 0 }}>{sensor.value}<span style={{ fontSize: '14px', color: '#94a3b8' }}>{sensor.unit}</span></h2>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', marginTop: '8px' }}>
                  <div style={{
                    width: `${Math.min(100, (sensor.value / (sensorKey === 'ftTemp' ? 50 : 100)) * 100)}%`,
                    height: '100%',
                    background: '#059669',
                    borderRadius: '3px'
                  }} />
                </div>
              </div>
            );
          })}
          {/* fallback: show live temp sensor if no humidity sensor */}
          {!data.sensors.some(k => ['ftHumidity', 'ftTemp'].includes(k)) && (
            data.sensors.map(sensorKey => {
              const sensor = data.live[sensorKey];
              if (!sensor) return null;
              return (
                <div key={sensorKey} style={{ marginBottom: '15px' }}>
                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 6px 0' }}>{sensor.label.toUpperCase()}</p>
                  <h2 style={{ margin: 0 }}>{sensor.value}<span style={{ fontSize: '14px', color: '#94a3b8' }}>{sensor.unit}</span></h2>
                  <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', marginTop: '8px' }}>
                    <div style={{ width: '40%', height: '100%', background: '#059669', borderRadius: '3px' }} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* GAS CONCENTRATION */}
        {gasEntries.length > 0 && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h3 style={{ margin: 0 }}>Gas Concentration</h3>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>PPM LEVELS</span>
            </div>
            <FlaskConical size={20} color="#059669" style={{ marginBottom: '15px' }} />
            {gasEntries.map(([key, gas]) => {
              const value = typeof gas === 'object' ? gas.value : gas;
              const unit = typeof gas === 'object' ? (gas.unit || 'ppm') : 'ppm';
              const max = 100;
              const pct = Math.min(100, (value / max) * 100);
              const barColor = pct > 70 ? '#ef4444' : pct > 40 ? '#f59e0b' : '#059669';
              return (
                <div key={key} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', margin: 0 }}>{key.toUpperCase()}</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{value} {unit}</p>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: '3px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}