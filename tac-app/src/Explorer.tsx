import { 
  Search, 
  Filter, 
  Sprout, 
  User, 
  Compass, 
  Store, 
  Info 
} from 'lucide-react';
import './index.css';

const TeleAgriApp = () => {
  return (
    <div className="app-container">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="C:\Users\H\Desktop\School\Year Two\Creative-Industries\tac-app\src\assets\tac logo.png" alt="Logo" style={{ width: '32px', height: '32px' }} />
          <h1 style={{ color: '#047857', margin: 0, fontSize: '20px' }}>TeleAgriCulture</h1>
        </div>
        <div style={{ background: '#1e293b', padding: '4px', borderRadius: '8px' }}>
          <User color="white" size={24} />
        </div>
      </header>

      <div className="search-container">
        <div className="search-bar">
          <Search size={20} color="#94a3b8" />
          <input type="text" placeholder="Search hubs..." style={{width: '100%', border: 'none', background: 'transparent'}} />
          <Filter size={20} color="#94a3b8" />
        </div>
      </div>

      <main className="map-area">
        <div className="globe">
          <div style={{ fontSize: '80px', textAlign: 'center', paddingTop: '40px' }}>🌍</div>
        </div>
      </main>

      <section className="details-card">
        <h2 style={{ margin: 0 }}>Austria</h2>
        <p style={{ color: '#64748b' }}>Real-time monitoring online.</p>
        <button className="btn btn-primary">DETAILS</button>
      </section>

      <nav className="bottom-nav">
        <Compass size={24} color="#059669" />
        <Store size={24} color="#94a3b8" />
        <Info size={24} color="#94a3b8" />
      </nav>
    </div>
  );
};

export default TeleAgriApp;