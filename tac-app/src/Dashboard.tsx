import { ChevronLeft, Sprout, User, Download, Thermometer, Droplets } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="app-container overflow-y" style={{ background: '#f8fafc' }}>
      <header className="header" style={{ background: 'white' }}>
        <ChevronLeft size={24} color="#059669" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sprout color="#059669" size={20} />
          <h1 style={{ color: '#047857', margin: 0, fontSize: '18px' }}>TeleAgriculture</h1>
        </div>
        <div style={{ background: '#1e293b', padding: '4px', borderRadius: '8px' }}><User color="white" size={20} /></div>
      </header>

      <div style={{ padding: '1.5rem' }}>
        <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '5px', fontSize: '10px', fontWeight: 'bold' }}>📍 LOCATION ANALYTICS</span>
        <h1 style={{ fontSize: '32px', margin: '10px 0' }}>Salzburg AT</h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 20px 0' }}>Real-time environmental monitoring and predictive growth analytics.</p>
        
        <button style={{ background: '#064e3b', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Download size={16} /> Export Report
        </button>

        <MetricCard title="SOIL MOISTURE" value="42%" sub="Medium Saturation" icon={<Sprout color="#92400e" />} />
        <MetricCard title="AIR TEMP" value="22°C" sub="Optimal growing range" icon={<Thermometer color="#b91c1c" />} />
        <MetricCard title="HUMIDITY" value="52.2%" sub="Relative air moisture" icon={<Droplets color="#1d4ed8" />} />
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, sub, icon }: any) => (
  <div style={{ background: 'white', padding: '20px', borderRadius: '15px', margin: '20px 0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ background: '#fff7ed', padding: '10px', borderRadius: '10px' }}>{icon}</div>
      <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>{title}</span>
    </div>
    <h1 style={{ fontSize: '36px', margin: '15px 0 5px 0' }}>{value}</h1>
    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>{sub}</p>
  </div>
);

export default Dashboard;