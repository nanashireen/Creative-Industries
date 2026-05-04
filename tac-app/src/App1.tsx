import { useState } from 'react';
import Explorer from './Explorer';
import ListedData from './ListedData';
import Dashboard from './Dashboard';

function App() {
  const [page, setPage] = useState('explorer');

  return (
    <div style={{ position: 'relative' }}>
      {/* Navigation Buttons for you to test */}
      <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 100, display: 'flex', gap: '5px' }}>
        <button onClick={() => setPage('explorer')}>1</button>
        <button onClick={() => setPage('data')}>2</button>
        <button onClick={() => setPage('dash')}>3</button>
      </div>

      {page === 'explorer' && <Explorer />}
      {page === 'data' && <ListedData />}
      {page === 'dash' && <Dashboard />}
    </div>
  );
}

export default App;