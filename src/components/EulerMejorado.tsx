// src/components/EulerMejorado.tsx

import React, { useState } from 'react';
import { improvedEulerMethod, Point } from '../utils/mathUtils';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const EulerMejorado: React.FC = () => {
  const [x0, setX0] = useState<number>(0);
  const [y0, setY0] = useState<number>(1);
  const [xEnd, setXEnd] = useState<number>(5);
  const [h, setH] = useState<number>(0.1);
  const [points, setPoints] = useState<Point[]>([]);

  // Función de la EDO: f(x,y) = 5*y - 25*x^2 + 2
  const f = (x: number, y: number): number => 5 * y - 25 * x * x + 2;

  // Función de la solución exacta: y(x) = 2*exp(5*x) + 5*x^2 + 2*x
  const expectedSolution = (x: number): number => 2 * Math.exp(5 * x) + 5 * x * x + 2 * x;

  const handleCalculate = () => {
    const result = improvedEulerMethod(f, x0, y0, xEnd, h);
    setPoints(result);
  };

  // Extraer valores para el gráfico y la tabla
  const x_vals = points.map(p => p.x);
  const y_aprox_vals = points.map(p => p.y);
  const exact_vals = points.map(p => expectedSolution(p.x));
  const error_vals = points.map(p => {
    const exact = expectedSolution(p.x);
    return exact !== 0 ? (100 * Math.abs(p.y - exact)) / exact : 0;
  });

  const solutionChartData = {
    labels: x_vals.map(x => x.toFixed(2)),
    datasets: [
      {
        label: 'Aproximación (Euler Mejorado)',
        data: y_aprox_vals,
        fill: false,
        borderColor: 'blue',
      },
      {
        label: 'Solución Exacta',
        data: exact_vals,
        fill: false,
        borderColor: 'red',
        borderDash: [5, 5],
      },
    ],
  };

  const errorChartData = {
    labels: x_vals.map(x => x.toFixed(2)),
    datasets: [
      {
        label: 'Error Porcentual (%)',
        data: error_vals,
        fill: false,
        borderColor: 'magenta',
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Método de Euler Mejorado (Heun) con Análisis de Error</h2>
      <div className="mb-4 flex flex-wrap gap-4">
        <div>
          <label className="block mb-1">x0:</label>
          <input
            type="number"
            value={x0}
            onChange={(e) => setX0(parseFloat(e.target.value))}
            className="border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">y0:</label>
          <input
            type="number"
            value={y0}
            onChange={(e) => setY0(parseFloat(e.target.value))}
            className="border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">xEnd:</label>
          <input
            type="number"
            value={xEnd}
            onChange={(e) => setXEnd(parseFloat(e.target.value))}
            className="border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">h:</label>
          <input
            type="number"
            value={h}
            onChange={(e) => setH(parseFloat(e.target.value))}
            className="border rounded px-3 py-2"
          />
        </div>
        <button
          onClick={handleCalculate}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Calcular
        </button>
      </div>

      {points.length > 0 && (
        <>
          {/* Gráfica de solución */}
          <div className="max-w-lg mx-auto mb-8">
            <Line data={solutionChartData} />
          </div>
          {/* Gráfica del error porcentual */}
          <div className="max-w-lg mx-auto mb-8">
            <Line data={errorChartData} />
          </div>
          {/* Tabla de resultados */}
          <h3 className="text-xl font-semibold mb-2">Resultados</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">x</th>
                  <th className="border px-4 py-2">y_aprox</th>
                  <th className="border px-4 py-2">y_exact</th>
                  <th className="border px-4 py-2">Error (%)</th>
                </tr>
              </thead>
              <tbody>
                {points.map((p, index) => (
                  <tr key={index} className="text-center">
                    <td className="border px-4 py-2">{p.x.toFixed(2)}</td>
                    <td className="border px-4 py-2">{p.y.toFixed(6)}</td>
                    <td className="border px-4 py-2">{exact_vals[index].toFixed(6)}</td>
                    <td className="border px-4 py-2">{error_vals[index].toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default EulerMejorado;
