// src/App.tsx

import React from 'react';
import EcuacionSolverMethods from './components/Euler';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex justify-center items-center bg-gray-100 p-6">
        <div className="bg-white shadow-2xl border border-gray-200 w-full max-w-4xl flex flex-col justify-center items-center p-8 rounded-md">
          <h1 className="text-3xl text-red-500 font-bold text-center mb-6">
            Resolución de EDOs con Métodos Numéricos
          </h1>
          <EcuacionSolverMethods />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
