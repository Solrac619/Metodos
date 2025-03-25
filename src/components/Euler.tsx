// src/components/Euler.tsx

import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { eulerMethod, Point } from '../utils/mathUtils'; // Usamos el método Euler definido en mathUtils

Chart.register(...registerables);

const Euler: React.FC = () => {
  // Nota: Ahora ya no hardcodeamos f y expectedSolution, pues la solución exacta se obtiene de la API.
  // Sin embargo, para comparar, aún calcularemos la aproximación de Euler localmente usando una función f.
  // Para este ejemplo, si la ecuación es "y' - y + x*x - 1 = 0", interpretamos que f(x,y)= y - x*x + 1.
  // Si cambias la ecuación, deberás actualizar esta función o implementar un parser (por ejemplo, mathjs).
  const f = (x: number, y: number): number => y - x * x + 1;

  // Método de Euler (importado de mathUtils)
  // Ya está implementado en mathUtils.ts

  // Estados para parámetros y resultados
  const [x0, setX0] = useState<number>(0);
  const [y0, setY0] = useState<number>(1);
  const [xEnd, setXEnd] = useState<number>(5);
  const [h, setH] = useState<number>(0.1);
  const [equation, setEquation] = useState<string>("y' - y = 0");
  const [solution, setSolution] = useState<string>('');
  const [methodUsed, setMethodUsed] = useState<string>('');
  const [apiError, setApiError] = useState<string>('');
  const [exactPoints, setExactPoints] = useState<Point[]>([]);
  const [eulerPoints, setEulerPoints] = useState<Point[]>([]);

  // Función que invoca la API para resolver la ecuación y obtener los puntos de la solución exacta
  const handleCalculate = async () => {
    const conditions = { 
      y0: y0.toString()
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/solve-ode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          equation: equation,
          conditions: conditions,
          x0: x0,
          xEnd: xEnd,
          h: h
        })
      });

      if (!response.ok) {
        throw new Error("Error en la llamada a la API");
      }

      const data = await response.json();
      setSolution(data.solution);
      setMethodUsed(data.method);
      setApiError('');
      setExactPoints(data.points); // Guardamos los puntos de la solución exacta
    } catch (err: any) {
      setApiError(err.message);
      setSolution('');
      setExactPoints([]);
    }

    // Calcular puntos usando el método de Euler localmente
    const ptsEuler = eulerMethod(f, x0, y0, xEnd, h);
    setEulerPoints(ptsEuler);
  };

  // Preparar datos para las gráficas
  const x_vals = exactPoints.map(p => p.x);
  const exact_y_vals = exactPoints.map(p => p.y);
  const euler_y_vals = eulerPoints.map(p => p.y);
  const error_vals = exactPoints.map((p, idx) => {
    const exact = p.y;
    const approx = euler_y_vals[idx] || 0;
    return exact !== 0 ? (Math.abs(approx - exact) / exact) * 100 : 0;
  });

  const solutionChartData = {
    labels: x_vals.map(x => x.toFixed(2)),
    datasets: [
      {
        label: 'Solución Exacta (API)',
        data: exact_y_vals,
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        borderDash: [5, 5]
      },
      {
        label: 'Solución Numérica (Euler)',
        data: euler_y_vals,
        fill: false,
        borderColor: 'rgb(75, 192, 192)'
      }
    ]
  };

  const errorChartData = {
    labels: x_vals.map(x => x.toFixed(2)),
    datasets: [
      {
        label: 'Error Porcentual (%)',
        data: error_vals,
        fill: false,
        borderColor: 'magenta'
      }
    ]
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Método de Euler (Integrado con API y Gráficas)
      </h2>
      <div className="mb-4 justify-center flex flex-wrap gap-4">
        <div>
          <label className="block mb-1">Ecuación:</label>
          <input
            type="text"
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            className="border rounded px-3 py-2 border-gray-400"
          />
        </div>
        <div>
          <label className="block mb-1">x0:</label>
          <input
            type="number"
            value={x0}
            onChange={(e) => setX0(parseFloat(e.target.value))}
            className="border rounded px-3 py-2 border-gray-400"
          />
        </div>
        <div>
          <label className="block mb-1">y0:</label>
          <input
            type="number"
            value={y0}
            onChange={(e) => setY0(parseFloat(e.target.value))}
            className="border rounded px-3 py-2 border-gray-400"
          />
        </div>
        <div>
          <label className="block mb-1">xEnd:</label>
          <input
            type="number"
            value={xEnd}
            onChange={(e) => setXEnd(parseFloat(e.target.value))}
            className="border rounded px-3 py-2 border-gray-400"
          />
        </div>
        <div>
          <label className="block mb-1">h:</label>
          <input
            type="number"
            value={h}
            onChange={(e) => setH(parseFloat(e.target.value))}
            className="border rounded px-3 py-2 border-gray-400"
          />
        </div>
        <button
          onClick={handleCalculate}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded"
        >
          Calcular
        </button>
      </div>

      {apiError && (
        <div className="text-red-600 mb-4">
          {apiError}
        </div>
      )}

      {solution && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Solución Exacta (API)</h3>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {solution}
          </pre>
          <p>Método utilizado: {methodUsed}</p>
        </div>
      )}

      {exactPoints.length > 0 && eulerPoints.length > 0 && (
        <>
          <div className="max-w-lg mx-auto mb-8">
            <Line data={solutionChartData} />
          </div>
          <div className="max-w-lg mx-auto mb-8">
            <Line data={errorChartData} />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center">Resultados</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">x</th>
                  <th className="border px-4 py-2">y_exact</th>
                  <th className="border px-4 py-2">y_aprox (Euler)</th>
                  <th className="border px-4 py-2">Error (%)</th>
                </tr>
              </thead>
              <tbody>
                {exactPoints.map((p, index) => (
                  <tr key={index} className="text-center">
                    <td className="border px-4 py-2">{p.x.toFixed(2)}</td>
                    <td className="border px-4 py-2">{p.y.toFixed(6)}</td>
                    <td className="border px-4 py-2">{eulerPoints[index] ? eulerPoints[index].y.toFixed(6) : '-'}</td>
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

export default Euler;
