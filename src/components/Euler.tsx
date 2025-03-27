// src/components/EcuacionSolverMethods.tsx

import React, { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  eulerMethod,
  improvedEulerMethod,
  rungeKuttaMethod,
  Point,
} from "../utils/mathUtils";

// Parámetros fijos (estos deben coincidir con los usados en el backend)
const x0 = 0;
const y0 = 1;
const xEnd = 5;
const h = 0.1;

// Para la ecuación "y' - y = 0" se deduce que y' = y, es decir, f(t,y)= y.
const f = (t: number, y: number): number => y;

const errorCalc = (approx: number, exact: number): number =>
  exact !== 0 ? (Math.abs(approx - exact) / exact) * 100 : 0;

const EcuacionSolverMethods: React.FC = () => {
  // El usuario solo ingresa la ecuación
  const [equation, setEquation] = useState<string>("y' - y = 0");
  const [solution, setSolution] = useState<string>("");
  const [methodUsed, setMethodUsed] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [exactPoints, setExactPoints] = useState<Point[]>([]);

  // Estados para las aproximaciones locales (calculadas con mathUtils)
  const [ptsEuler, setPtsEuler] = useState<Point[]>([]);
  const [ptsImproved, setPtsImproved] = useState<Point[]>([]);
  const [ptsRK, setPtsRK] = useState<Point[]>([]);

  // Al hacer clic, se envía la ecuación al backend. El backend usa los parámetros por defecto.
  const handleSolve = async () => {
    setApiError("");
    try {
      const response = await axios.post("http://127.0.0.1:5000/solve-ode", {
        equation,
      });
      const data = response.data;
      setSolution(data.solution);
      setMethodUsed(data.method);
      // Se espera que data.points tenga la forma { x: [...], y: [...] }
      const pts: Point[] = data.points && data.points.x
        ? data.points.x.map((x: number, idx: number) => ({
            x,
            y: data.points.y[idx],
          }))
        : [];
      setExactPoints(pts);
    } catch (err: any) {
      setApiError(err.response?.data?.error || "Error desconocido");
      setSolution("");
      setExactPoints([]);
    }
    // Calcular las aproximaciones locales con mathUtils usando la función f y parámetros fijos
    setPtsEuler(eulerMethod(f, x0, y0, xEnd, h));
    setPtsImproved(improvedEulerMethod(f, x0, y0, xEnd, h));
    setPtsRK(rungeKuttaMethod(f, x0, y0, xEnd, h));
  };

  // Preparar datos para las gráficas
  const x_vals = exactPoints.map((p) => p.x);
  const exact_y_vals = exactPoints.map((p) => p.y);
  const euler_y_vals = ptsEuler.map((p) => p.y);
  const improved_y_vals = ptsImproved.map((p) => p.y);
  const rk_y_vals = ptsRK.map((p) => p.y);

  // Calcular errores porcentuales para cada método (basados en la solución exacta)
  const errorEuler = exactPoints.map((p, idx) =>
    errorCalc(ptsEuler[idx]?.y || 0, p.y)
  );
  const errorImproved = exactPoints.map((p, idx) =>
    errorCalc(ptsImproved[idx]?.y || 0, p.y)
  );
  const errorRK = exactPoints.map((p, idx) =>
    errorCalc(ptsRK[idx]?.y || 0, p.y)
  );

  // Datos para la gráfica de la solución exacta (devuelta por la API)
  const exactChartData = {
    labels: x_vals.map((x) => x.toFixed(2)),
    datasets: [
      {
        label: "Solución Exacta (API)",
        data: exact_y_vals,
        fill: false,
        borderColor: "red",
        borderDash: [5, 5],
      },
    ],
  };

  // Datos para las gráficas de aproximaciones
  const eulerChartData = {
    labels: ptsEuler.map((p) => p.x.toFixed(2)),
    datasets: [
      {
        label: "Euler",
        data: euler_y_vals,
        fill: false,
        borderColor: "blue",
      },
    ],
  };

  const improvedChartData = {
    labels: ptsImproved.map((p) => p.x.toFixed(2)),
    datasets: [
      {
        label: "Euler Mejorado",
        data: improved_y_vals,
        fill: false,
        borderColor: "green",
      },
    ],
  };

  const rkChartData = {
    labels: ptsRK.map((p) => p.x.toFixed(2)),
    datasets: [
      {
        label: "Runge-Kutta",
        data: rk_y_vals,
        fill: false,
        borderColor: "orange",
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Solver de Ecuaciones Diferenciales
      </h2>
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          placeholder="Ingresa la ecuación (ej: y' - y = 0)"
          className="border p-2 w-full max-w-md mb-4"
        />
        <button
          onClick={handleSolve}
          className="ml-4 bg-yellow-500 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded"
        >
          Calcular
        </button>
      </div>
      {apiError && <p className="text-red-500 mb-4">{apiError}</p>}
      {solution && (
        <div className="mb-4">
          <h3 className="font-semibold">Solución Exacta (API):</h3>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {solution}
          </pre>
          <p>Método utilizado: {methodUsed}</p>
        </div>
      )}
      {exactPoints.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-2">Gráficas de Soluciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="border p-4 rounded shadow">
              <h4 className="font-semibold mb-2">Solución Exacta (API)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={exactPoints}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="y" stroke="red" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="border p-4 rounded shadow">
              <h4 className="font-semibold mb-2">Euler</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ptsEuler}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="y" stroke="blue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="border p-4 rounded shadow">
              <h4 className="font-semibold mb-2">Euler Mejorado</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ptsImproved}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="y" stroke="green" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="border p-4 rounded shadow">
              <h4 className="font-semibold mb-2">Runge-Kutta</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ptsRK}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="x" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="y" stroke="orange" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center">Tabla de Errores (%)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">x</th>
                  <th className="border px-4 py-2">Error Euler</th>
                  <th className="border px-4 py-2">Error Euler Mejorado</th>
                  <th className="border px-4 py-2">Error Runge-Kutta</th>
                </tr>
              </thead>
              <tbody>
                {exactPoints.map((p, idx) => {
                  const errEuler = ptsEuler[idx] ? errorCalc(ptsEuler[idx].y, p.y) : 0;
                  const errImproved = ptsImproved[idx] ? errorCalc(ptsImproved[idx].y, p.y) : 0;
                  const errRK = ptsRK[idx] ? errorCalc(ptsRK[idx].y, p.y) : 0;
                  return (
                    <tr key={idx} className="text-center">
                      <td className="border px-4 py-2">{p.x.toFixed(2)}</td>
                      <td className="border px-4 py-2">{errEuler.toFixed(2)}</td>
                      <td className="border px-4 py-2">{errImproved.toFixed(2)}</td>
                      <td className="border px-4 py-2">{errRK.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default EcuacionSolverMethods;
