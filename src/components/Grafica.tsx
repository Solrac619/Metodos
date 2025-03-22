import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export interface Point {
  x: number;
  y: number;
}

interface GraphProps {
  points: Point[];
  label: string;
  borderColor?: string;
}

const Graph: React.FC<GraphProps> = ({ points, label, borderColor = 'rgb(75, 192, 192)' }) => {
  const chartData = {
    labels: points.map((point) => point.x.toFixed(2)),
    datasets: [
      {
        label,
        data: points.map((point) => point.y),
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

export default Graph;