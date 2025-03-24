// src/App.tsx

import React, { useState } from 'react';
import Euler from './components/Euler';
import EulerMejorado from './components/EulerMejorado';
import RungeKutta from './components/RungeKutta';
import Header from './components/Header'
import Footer from './components/Footer';

const App: React.FC = () => {
  const [method, setMethod] = useState<string>('euler');

  return (
    <>
    <Header/>
    <div className="p-4 bg-white shadow-2xl border border-gray-200 w-[40vw] flex justify-center items-center flex-col mx-auto my-[5vh] rounded-md">
      <h1 className="text-3xl text-red-500 font-bold text-center mb-6">
        Resolución de EDOs con Métodos Numéricos
      </h1>
      <nav className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setMethod('euler')}
          className={`px-4 py-2 rounded ${
            method === 'euler' ? 'bg-yellow-500 text-white' : 'bg-gray-200'
          }`}
        >
          Euler
        </button>
        <button
          onClick={() => setMethod('eulerMejorado')}
          className={`px-4 py-2 rounded ${
            method === 'eulerMejorado' ? 'bg-blue-800 text-white' : 'bg-gray-200'
          }`}
        >
          Euler Mejorado
        </button>
        <button
          onClick={() => setMethod('rungeKutta')}
          className={`px-4 py-2 rounded ${
            method === 'rungeKutta' ? 'bg-green-600 text-white' : 'bg-gray-200'
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
    <Footer/>
    </>
  );
};

export default App;
