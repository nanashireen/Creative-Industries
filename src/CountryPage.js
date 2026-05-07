import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Wind } from 'lucide-react';
import './index.css';
import tacLogo from './assets/tac logo.png';

const mockData = {
  AT: { name: "Austria", station: "SLZ-BOT-0942", deployment: "#SALZ-2024-QX" },
  DE: { name: "Germany", station: "BER-AGRI-1102", deployment: "#BER-2024-V2" },
  GB: { name: "United Kingdom", station: "LON-GRN-8821", deployment: "#UK-2024-ST" },
  US: { name: "United States", station: "NYC-VRT-5501", deployment: "#USA-2024-NY" },
  TG: { name: "Togo", station: "LOM-AGR-3304", deployment: "#TGO-2024-AF" },
  FI: { name: "Finland", station: "HEL-CLD-0091", deployment: "#FIN-2024-NR" }
};

const DataRow = ({ label, value, unit, progress }) => (
  <div style={{ marginBottom: '15px' }}>
    <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 5px 0' }}>{label}</p>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <h2 style={{ margin: 0 }}>{value}<span style={{ fontSize: '14px', color: '#94a3b8' }}>{unit}</span></h2>
      <div style={{ width: '100px', height: '4px', background: '#f1f5f9', borderRadius: '2px' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#059669', borderRadius: '2px' }} />
      </div>
    </div>
  </div>
);

export default function CountryRawData() {
  const { code } = useParams();
  const navigate = useNavigate();

  const countryCode = code ? code.toUpperCase() : 'AT';
  const data = mockData[countryCode];

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
          {data.name}<br />Raw Data
        </h1>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '30px' }}>
          <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>● LIVE STREAMING</span>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Station ID: {data.station}</span>
        </div>

        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>DEPLOYMENT ID</p>
          <h2 style={{ margin: '5px 0' }}>{data.deployment}</h2>
          <p style={{ fontSize: '10px', color: '#059669', margin: 0 }}>🛡️ VERIFIED SIGNATURE</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>LAST SYNC</p>
          <h2 style={{ margin: '5px 0' }}>02:44:12 <span style={{ fontSize: '12px', color: '#94a3b8' }}>GMT+1</span></h2>
          <p style={{ fontSize: '12px', color: '#059669', margin: 0 }}>14 seconds ago</p>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Atmospheric Data</h3>
            <Wind size={20} color="#059669" />
          </div>
          <DataRow label="AMBIENT TEMP" value="22.4" unit="°C" progress={40} />
          <DataRow label="HUMIDITY" value="64.1" unit="%" progress={70} />
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>AIR PRESSURE</p>
            <h2 style={{ margin: 0 }}>1013<span style={{ fontSize: '14px', color: '#94a3b8' }}>mPa</span></h2>
          </div>
        </div>
      </div>
    </div>
  );
}