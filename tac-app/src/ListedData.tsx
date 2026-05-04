import { ChevronLeft, Sprout, User, Wind, FlaskConical } from 'lucide-react';
import './index.css';

const ListedData = () => {
  return (
    <div className="app-container overflow-y">
      <header className="header">
        <ChevronLeft size={24} color="#059669" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sprout color="#059669" size={20} />
          <h1 style={{ color: '#047857', margin: 0, fontSize: '18px' }}>TeleAgriculture</h1>
        </div>
        <div style={{ background: '#1e293b', padding: '4px', borderRadius: '8px' }}><User color="white" size={20} /></div>
      </header>

      <div style={{ padding: '0 2rem' }}>
        <h1 style={{ fontSize: '42px', margin: '10px 0', lineHeight: '1' }}>Salzburg<br/>Raw Data</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>● LIVE STREAMING</span>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Station ID: SLZ-BOT-0942</span>
        </div>

        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px', margin: '30px 0', border: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>DEPLOYMENT ID</p>
          <h2 style={{ margin: '5px 0' }}>#SALZ-2024-QX</h2>
          <p style={{ fontSize: '10px', color: '#059669', margin: 0 }}>🛡️ VERIFIED SIGNATURE</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
           <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>LAST SYNC</p>
           <h2 style={{ margin: '5px 0' }}>02:44:12 <span style={{fontSize: '12px', color: '#94a3b8'}}>GMT+1</span></h2>
           <p style={{ fontSize: '12px', color: '#059669' }}>14 seconds ago</p>
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
            <h2 style={{ margin: 0 }}>1013<span style={{fontSize: '14px', color: '#94a3b8'}}>mPa</span></h2>
          </div>
        </div>
      </div>
    </div>
  );
};

const DataRow = ({ label, value, unit, progress }: any) => (
  <div style={{ marginBottom: '15px' }}>
    <p style={{ fontSize: '10px', color: '#94a3b8', margin: '0 0 5px 0' }}>{label}</p>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <h2 style={{ margin: 0 }}>{value}<span style={{fontSize: '14px', color: '#94a3b8'}}>{unit}</span></h2>
      <div style={{ width: '100px', height: '4px', background: '#f1f5f9', borderRadius: '2px' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#059669', borderRadius: '2px' }} />
      </div>
    </div>
  </div>
);

export default ListedData;