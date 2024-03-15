// Import React
import React from 'react';
// Import the chart type
import { Bar } from 'react-chartjs-2';
// Import Chart.js to ensure it's registered
import 'chart.js/auto';

// Data and options for the chart
const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

const options = {
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

const MyChartComponent = () => (
  <div style={{ height: '300px', width: '500px' }}>
    <Bar data={data} options={options} />
  </div>
);

export default MyChartComponent;
