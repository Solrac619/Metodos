// src/components/RungeKutta.tsx

import React, { useState } from 'react';
import { rungeKuttaMethod, Point } from '../utils/mathUtils';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const RungeKutta: React.FC = () => {
  const [x0, setX0] = useState<number>(0);
  const [y0, setY0] = useState<number>(1);
  const [xEnd, setXEnd] = useState<number>(5);
  const [h, setH] = useState<number>(0.1);
  const [points, setPoints] = useState<Point[]>([]);

  // Definición de la EDO: y' = y - x^2 + 1
  const f = (x: number, y: number): number => y - x * x + 1;

  // Función de la solución exacta: y(x) = (x+1)^2
  const expectedSolution = (x: number): number => (x + 1) ** 2;

  // Calcula los puntos usando el método de Runge-Kutta (4º orden)
  const handleCalculate = () => {
    const result = rungeKuttaMethod(f, x0, y0, xEnd, h);
    setPoints(result);
  };

  // Extraer arreglos de datos
  const x_vals = points.map(p => p.x);
  const y_aprox_vals = points.map(p => p.y);
  const exact_vals = points.map(p => expectedSolution(p.x));
  const error_vals = points.map(p => {
    const exact = expectedSolution(p.x);
    return exact !== 0 ? (100 * Math.abs(p.y - exact)) / exact : 0;
  });

  // Configuración de la gráfica de solución (aproximación vs. exacta)
  const solutionChartData = {
    labels: x_vals.map(x => x.toFixed(2)),
    datasets: [
      {
        label: 'Solución Numérica (Runge-Kutta)',
        data: y_aprox_vals,
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
      },
      {
        label: 'Solución Exacta',
        data: exact_vals,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        borderDash: [5, 5],
      },
    ],
  };

  // Configuración de la gráfica del error porcentual
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
      <h2 className="text-2xl font-bold mb-4">Método de Runge-Kutta (4º orden) con Análisis de Error</h2>
      
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
          {/* Gráfica de la solución */}
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

export default RungeKutta;
