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

  // Calcula los puntos usando el método de Euler Mejorado (predictor-corrector)
  const handleCalculate = () => {
    // Usamos el método definido en utils para obtener el conjunto de puntos
    const result = improvedEulerMethod(f, x0, y0, xEnd, h);
    setPoints(result);
  };

    // Extraemos los valores de x, y, y_exacta y error porcentual para cada punto
  const x_vals = points.map((p) => p.x);
  const y_aprox_vals = points.map((p) => p.y);
  const exact_vals = points.map((p) => expectedSolution(p.x));
  const error_vals = points.map((p) => {
    const exact = expectedSolution(p.x);
    return exact !== 0 ? 100 * Math.abs(p.y - exact) / exact : 0;
  });
  

  // Datos para la gráfica de la solución
  const solutionChartData = {
    labels: x_vals.map((x) => x.toFixed(2)),
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

  // Datos para la gráfica del error porcentual
  const errorChartData = {
    labels: x_vals.map((x) => x.toFixed(2)),
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
    <div style={{ padding: '1rem' }}>
      <h2>Método de Euler Mejorado (Heun) con Análisis de Error</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          x0:
          <input
            type="number"
            value={x0}
            onChange={(e) => setX0(parseFloat(e.target.value))}
            style={{ margin: '0 1rem' }}
          />
        </label>
        <label>
          y0:
          <input
            type="number"
            value={y0}
            onChange={(e) => setY0(parseFloat(e.target.value))}
            style={{ margin: '0 1rem' }}
          />
        </label>
        <label>
          xEnd:
          <input
            type="number"
            value={xEnd}
            onChange={(e) => setXEnd(parseFloat(e.target.value))}
            style={{ margin: '0 1rem' }}
          />
        </label>
        <label>
          h:
          <input
            type="number"
            value={h}
            onChange={(e) => setH(parseFloat(e.target.value))}
            style={{ margin: '0 1rem' }}
          />
        </label>
        <button onClick={handleCalculate}>Calcular</button>
      </div>

      {points.length > 0 && (
        <>
          {/* Gráfica de solución: Aproximación vs Solución Exacta */}
          <div style={{ maxWidth: '600px', marginBottom: '2rem' }}>
            <Line data={solutionChartData} />
          </div>
          {/* Gráfica del error porcentual en cada paso */}
          <div style={{ maxWidth: '600px', marginBottom: '2rem' }}>
            <Line data={errorChartData} />
          </div>
          {/* Tabla de resultados */}
          <h3>Resultados</h3>
          <table border={1} cellPadding={5} style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>x</th>
                <th>y_aprox</th>
                <th>y_exact</th>
                <th>Error (%)</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p, index) => (
                <tr key={index}>
                  <td>{p.x.toFixed(2)}</td>
                  <td>{p.y.toFixed(6)}</td>
                  <td>{exact_vals[index].toFixed(6)}</td>
                  <td>{error_vals[index].toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default EulerMejorado;