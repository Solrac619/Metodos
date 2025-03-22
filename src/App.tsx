import React, { useState } from 'react';
import Euler from './components/Euler';
import EulerMejorado from './components/EulerMejorado';
import RungeKutta from './components/RungeKutta';

const App: React.FC = () => {
  const [method, setMethod] = useState<string>('euler');

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Resolución de EDOs con Métodos Numéricos</h1>
      <nav style={{ marginBottom: '1rem' }}>
        <button onClick={() => setMethod('euler')} style={{ marginRight: '0.5rem' }}>
          Euler
        </button>
        <button onClick={() => setMethod('eulerMejorado')} style={{ marginRight: '0.5rem' }}>
          Euler Mejorado
        </button>
        <button onClick={() => setMethod('rungeKutta')}>
          Runge-Kutta
        </button>
      </nav>

      {method === 'euler' && <Euler />}
      {method === 'eulerMejorado' && <EulerMejorado />}
      {method === 'rungeKutta' && <RungeKutta />} 
    </div>
  );
};

export default App;
