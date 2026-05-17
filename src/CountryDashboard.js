import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, BarChart2, Droplets, FlaskConical } from 'lucide-react';
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
const GREEN_FAINT = 'rgba(56,188,120,0.12)';

export default function CountryDashboard() {
  const { code } = useParams();
  const navigate = useNavigate();

  const countryCode = code ? code.toUpperCase() : 'AT';
  const data = kitData[countryCode];

  if (!data) return (
    <div style={{ padding: '50px', textAlign: 'center', background: '#1a2e22', minHeight: '100vh', color: 'white' }}>
      <h2>Data Not Found</h2><button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  const gasEntries = Object.entries(data.gas_concentration || {});

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
          {data.location}<br />Dashboard
        </h1>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ background: GREEN_FAINT, color: GREEN, padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', border: `1px solid ${GREEN_DIM}` }}>● LIVE</span>
          <span style={{ color: GREEN_DIM, fontSize: '13px' }}>Kit ID: {data.kit_id}</span>
        </div>

        {/* EFFICIENCY TREND */}
        <div style={CARD}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>Efficiency Trend</h3>
            <BarChart2 size={20} color={GREEN} />
          </div>
          <p style={{ fontSize: '13px', color: GREEN_DIM, margin: '0 0 15px 0' }}>System performance over 24H</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '80px' }}>
            {data.efficiency_trend.map((point, i) => (
              <div key={i} style={{ flex: 1, height: `${point.efficiency_pct}%`, background: point.efficiency_pct > 80 ? GREEN : point.efficiency_pct > 50 ? '#f59e0b' : '#ef4444', borderRadius: '3px 3px 0 0', minHeight: '4px' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: GREEN_DIM }}>00:00</span>
            <span style={{ fontSize: '11px', color: GREEN_DIM }}>12:00</span>
            <span style={{ fontSize: '11px', color: GREEN_DIM }}>23:00</span>
          </div>
          <p style={{ fontSize: '15px', color: GREEN, fontWeight: 'bold', margin: '10px 0 0 0' }}>Avg: {data.efficiency_avg}%</p>
        </div>

        {/* SENSOR ANALYTICS */}
        {data.sensors.map(sensorKey => {
          const analytics = data.analytics[sensorKey];
          if (!analytics) return null;
          return (
            <div key={sensorKey} style={CARD}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>{analytics.label}</h3>
                <span style={{ background: GREEN_FAINT, color: GREEN, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', border: `1px solid ${GREEN_DIM}` }}>
                  {analytics.state.toUpperCase()}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: GREEN_DIM, margin: '0 0 15px 0' }}>{analytics.description}</p>
              <h2 style={{ margin: '0 0 5px 0', color: 'white', fontSize: '28px' }}>{analytics.value}<span style={{ fontSize: '16px', color: GREEN_DIM }}>{analytics.unit}</span></h2>
              <div style={{ display: 'flex', gap: '15px', fontSize: '13px', color: GREEN_DIM, marginTop: '10px' }}>
                <span>MIN: <b style={{ color: 'white' }}>{analytics.min_24h}{analytics.unit}</b></span>
                <span>AVG: <b style={{ color: 'white' }}>{analytics.mean_24h}{analytics.unit}</b></span>
                <span>MAX: <b style={{ color: 'white' }}>{analytics.max_24h}{analytics.unit}</b></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '50px', marginTop: '15px' }}>
                {analytics.trend.filter((_, i) => i % 3 === 0).map((point, i) => (
                  <div key={i} style={{ flex: 1, height: `${Math.max(10, ((point.value - analytics.min_24h) / ((analytics.max_24h - analytics.min_24h) || 1)) * 100)}%`, background: GREEN, borderRadius: '2px 2px 0 0', opacity: 0.7 }} />
                ))}
              </div>
            </div>
          );
        })}

        {/* RELATIVE AIR MOISTURE */}
        <div style={CARD}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>Relative Air Moisture</h3>
            <Droplets size={20} color={GREEN} />
          </div>
          {data.sensors.some(k => ['ftHumidity', 'ftTemp'].includes(k)) ? (
            data.sensors.map(sensorKey => {
              const sensor = data.live[sensorKey];
              if (!sensor || !['ftHumidity', 'ftTemp'].includes(sensorKey)) return null;
              const analytics = data.analytics[sensorKey];
              return (
                <div key={sensorKey} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <p style={{ fontSize: '11px', color: GREEN_DIM, margin: 0, letterSpacing: '0.05em' }}>{sensor.label.toUpperCase()}</p>
                    <p style={{ fontSize: '11px', color: GREEN_DIM, margin: 0 }}>24H AVG: <b style={{ color: 'white' }}>{analytics?.mean_24h}{sensor.unit}</b></p>
                  </div>
                  <h2 style={{ margin: 0, color: 'white', fontSize: '28px' }}>{sensor.value}<span style={{ fontSize: '16px', color: GREEN_DIM }}>{sensor.unit}</span></h2>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '8px' }}>
                    <div style={{ width: `${Math.min(100, (sensor.value / (sensorKey === 'ftTemp' ? 50 : 100)) * 100)}%`, height: '100%', background: GREEN, borderRadius: '3px' }} />
                  </div>
                </div>
              );
            })
          ) : (
            data.sensors.map(sensorKey => {
              const sensor = data.live[sensorKey];
              if (!sensor) return null;
              return (
                <div key={sensorKey} style={{ marginBottom: '15px' }}>
                  <p style={{ fontSize: '11px', color: GREEN_DIM, margin: '0 0 6px 0', letterSpacing: '0.05em' }}>{sensor.label.toUpperCase()}</p>
                  <h2 style={{ margin: 0, color: 'white', fontSize: '28px' }}>{sensor.value}<span style={{ fontSize: '16px', color: GREEN_DIM }}>{sensor.unit}</span></h2>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '8px' }}>
                    <div style={{ width: '40%', height: '100%', background: GREEN, borderRadius: '3px' }} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* GAS CONCENTRATION */}
        {gasEntries.length > 0 && (
          <div style={CARD}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>Gas Concentration</h3>
              <span style={{ fontSize: '11px', color: GREEN_DIM, letterSpacing: '0.05em' }}>PPM LEVELS</span>
            </div>
            <FlaskConical size={20} color={GREEN} style={{ marginBottom: '15px' }} />
            {gasEntries.map(([key, gas]) => {
              const value = typeof gas === 'object' ? gas.value : gas;
              const unit = typeof gas === 'object' ? (gas.unit || 'ppm') : 'ppm';
              const pct = Math.min(100, (value / 100) * 100);
              const barColor = pct > 70 ? '#ef4444' : pct > 40 ? '#f59e0b' : GREEN;
              return (
                <div key={key} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: 'white' }}>{key.toUpperCase()}</p>
                    <p style={{ fontSize: '13px', color: GREEN_DIM, margin: 0 }}>{value} {unit}</p>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
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