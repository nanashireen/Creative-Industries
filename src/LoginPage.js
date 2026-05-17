import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import tacLogo from './assets/tac logo.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);

  const handleStart = () => {
    setTransitioning(true);
    setTimeout(() => navigate('/globe'), 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0a1a14 0%, #0f2d1f 50%, #0a1a14 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      opacity: transitioning ? 0 : 1,
      transition: 'opacity 0.8s ease',
    }}>

      {/* GLOW BACKGROUND EFFECT */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(5,150,105,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* LOGO */}
      <img
        src={tacLogo}
        alt="TeleAgriCulture"
        style={{
          height: '70px',
          objectFit: 'contain',
          marginBottom: '40px',
          filter: 'brightness(0) invert(1)',
        }}
      />

      {/* TAGLINE */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{
          fontSize: '38px',
          fontWeight: '700',
          color: 'white',
          margin: '0 0 16px 0',
          lineHeight: '1.2',
          fontFamily: 'Lexend, sans-serif',
        }}>
          Monitor the world's<br />agricultural future
        </h1>
        <p style={{
          fontSize: '15px',
          color: 'rgba(168,230,207,0.7)',
          margin: 0,
          lineHeight: '1.6',
          maxWidth: '280px',
        }}>
          Real-time environmental monitoring and predictive growth analytics for urban agricultural zones.
        </p>
      </div>

      {/* STATS ROW */}
      <div style={{
        display: 'flex',
        gap: '30px',
        marginBottom: '60px',
      }}>
        {[
          { value: '6+', label: 'Countries' },
          { value: '24H', label: 'Live Data' },
          { value: '99%', label: 'Uptime' },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '26px',
              fontWeight: 'bold',
              color: '#a8e6cf',
              margin: '0 0 4px 0',
              fontFamily: 'Lexend, sans-serif',
            }}>{stat.value}</p>
            <p style={{
              fontSize: '11px',
              color: 'rgba(168,230,207,0.5)',
              margin: 0,
              letterSpacing: '0.05em',
            }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* GET STARTED BUTTON */}
      <button
        onClick={handleStart}
        style={{
          width: '100%',
          maxWidth: '320px',
          padding: '18px',
          background: '#059669',
          color: 'white',
          border: 'none',
          borderRadius: '14px',
          fontSize: '16px',
          fontWeight: 'bold',
          letterSpacing: '0.08em',
          cursor: 'pointer',
          textTransform: 'uppercase',
          fontFamily: 'Lexend, sans-serif',
          boxShadow: '0 0 30px rgba(5,150,105,0.4)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
        onMouseEnter={e => {
          e.target.style.transform = 'scale(1.02)';
          e.target.style.boxShadow = '0 0 40px rgba(5,150,105,0.6)';
        }}
        onMouseLeave={e => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 0 30px rgba(5,150,105,0.4)';
        }}
      >
        Get Started
      </button>

      {/* BOTTOM NOTE */}
      <p style={{
        marginTop: '24px',
        fontSize: '12px',
        color: 'rgba(168,230,207,0.35)',
        textAlign: 'center',
      }}>
        TeleAgriCulture · Environmental Intelligence Platform
      </p>
    </div>
  );
}