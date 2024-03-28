// Import React
import React from 'react';
// Import the chart type
import { Bar } from 'react-chartjs-2';
// Import Chart.js to ensure it's registered
import 'chart.js/auto';

const TrainingModulesBarChart = ({ chartData }) => {
  // Prepare the data structure for Chart.js using the props
  const data = {
    labels: chartData.labels, // Use employee names as labels
    datasets: [
      {
        label: 'Trainings Assigned',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: chartData.assignedCount, // Use assigned training count
      },
      {
        label: 'Trainings Completed',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.4)',
        hoverBorderColor: 'rgba(54, 162, 235, 1)',
        data: chartData.completedCount, // Use completed training count
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Trainings'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Employees'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Employee Training Status'
      },
    },
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TrainingModulesBarChart;
