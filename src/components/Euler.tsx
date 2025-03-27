import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import katex from 'katex';

interface SolutionData {
  x: number[];
  y: number[];
}

interface ApiResponse {
  solution: string;
  exact: SolutionData;
  methods: {
    euler: SolutionData;
    improved: SolutionData;
    rk: SolutionData;
  };
  errors: {
    euler: SolutionData;
    improved: SolutionData;
    rk: SolutionData;
  };
}

const EcuacionSolverMethods: React.FC = () => {
  const [equation, setEquation] = useState("y' = y");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState('');

  const handleSolve = async () => {
    try {
      const res = await fetch('http://localhost:5000/solve-ode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equation: equation,
          conditions: { y0: 1 },
          x0: 0,
          xEnd: 5,
          h: 0.1
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error desconocido');
      }

      const data: ApiResponse = await res.json();
      setResponse(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setResponse(null);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Solver de Ecuaciones Diferenciales</h1>
      
      {/* Formulario */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          placeholder="Ej: y' = y + t"
          className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSolve}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Resolver
        </button>
      </div>

      {/* Mensaje de error */}
      {error && <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-6">{error}</div>}

      {/* Resultados */}
      {response && (
        <div className="space-y-8">
          {/* Solución Exacta */}
          <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
  <h2 className="text-xl font-semibold mb-4">Solución Exacta</h2>
  <div 
    dangerouslySetInnerHTML={{
      __html: katex.renderToString(response.solution, {
        throwOnError: false,
        displayMode: true
      })
    }}
  />
</div>

          {/* Gráficas Individuales */}
          <div className="grid md:grid-cols-1 gap-4">
            {Object.entries(response.methods).map(([method, data]) => (
              <div key={method} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 capitalize">{method}</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.x.map((x, i) => ({
                      x: x,
                      Exacta: response.exact.y[i],
                      [method]: data.y[i]
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="x" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Exacta"
                        stroke="#ef4444"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey={method}
                        stroke="#3b82f6"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
           {/* Tabla de Errores */}
           <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Errores Porcentuales</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">x</th>
                    <th className="px-4 py-2 text-center">Euler (%)</th>
                    <th className="px-4 py-2 text-center">Euler Mejorado (%)</th>
                    <th className="px-4 py-2 text-center">Runge-Kutta (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {response.exact.x.map((x, index) => (
                    <tr key={x} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{x.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center">
                        {response.errors.euler.y[index].toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {response.errors.improved.y[index].toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {response.errors.rk.y[index].toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcuacionSolverMethods;