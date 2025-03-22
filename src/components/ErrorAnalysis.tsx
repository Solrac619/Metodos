// src/components/ErrorAnalysis.tsx

import React from 'react';
import { Point } from '../utils/mathUtils';

interface ErrorAnalysisProps {
  points: Point[];
  expected: (x: number) => number;
}

const ErrorAnalysis: React.FC<ErrorAnalysisProps> = ({ points, expected }) => {
  // Se calcula el error para cada punto: |valor esperado - valor numérico|
  const errors = points.map(point => {
    const expectedValue = expected(point.x);
    const error = Math.abs(expectedValue - point.y);
    return { ...point, expected: expectedValue, error };
  });

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Análisis de Error</h3>
      <table border={1} cellPadding={5} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>x</th>
            <th>Valor Numérico</th>
            <th>Valor Esperado</th>
            <th>Error Absoluto</th>
          </tr>
        </thead>
        <tbody>
          {errors.map((item, index) => (
            <tr key={index}>
              <td>{item.x.toFixed(2)}</td>
              <td>{item.y.toFixed(4)}</td>
              <td>{item.expected.toFixed(4)}</td>
              <td>{item.error.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ErrorAnalysis;
