// src/App.tsx

import React, { useState } from 'react';
import Euler from './components/Euler';
import EulerMejorado from './components/EulerMejorado';
import RungeKutta from './components/RungeKutta';

const App: React.FC = () => {
  const [method, setMethod] = useState<string>('euler');

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Resolución de EDOs con Métodos Numéricos
      </h1>
      <nav className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setMethod('euler')}
          className={`px-4 py-2 rounded ${
            method === 'euler' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Euler
        </button>
        <button
          onClick={() => setMethod('eulerMejorado')}
          className={`px-4 py-2 rounded ${
            method === 'eulerMejorado' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Euler Mejorado
        </button>
        <button
          onClick={() => setMethod('rungeKutta')}
          className={`px-4 py-2 rounded ${
            method === 'rungeKutta' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Runge-Kutta
        </button>
      </nav>
      <div>
        {method === 'euler' && <Euler />}
        {method === 'eulerMejorado' && <EulerMejorado />}
        {method === 'rungeKutta' && <RungeKutta />}
      </div>
    </div>
  );
};

export default App;
