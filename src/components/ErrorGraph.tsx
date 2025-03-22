import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export interface Point {
  x: number;
  y: number;
}

interface ErrorGraphProps {
  points: Point[];
  expected: (x: number) => number;
  label?: string;
  borderColor?: string;
}

const ErrorGraph: React.FC<ErrorGraphProps> = ({
  points,
  expected,
  label = 'Error Absoluto',
  borderColor = 'rgb(255, 99, 132)',
}) => {
  // Calcula el error absoluto en cada punto
  const errors = points.map(point => Math.abs(expected(point.x) - point.y));

  const chartData = {
    labels: points.map(point => point.x.toFixed(2)),
    datasets: [
      {
        label,
        data: errors,
        fill: false,
        borderColor,
      },
    ],
  };

  return (
    <div style={{ maxWidth: '600px', marginBottom: '2rem' }}>
      <Line data={chartData} />
    </div>
  );
};

export default ErrorGraph;
