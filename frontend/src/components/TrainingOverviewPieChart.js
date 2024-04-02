// Import React
import React, { useState, useEffect } from 'react';
// Import the Pie chart type
import { Pie } from 'react-chartjs-2';
// Import Chart.js to ensure it's registered
import 'chart.js/auto';

const TrainingOverviewPieChart = ({ assignedCount, completedCount }) => {
  // Prepare the data structure for Chart.js using the props
  const data = {
    labels: ['Trainings Completed', 'Trainings Assigned'],
    datasets: [
      {
        label: 'Training Overview',
        data: [completedCount, assignedCount],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Training Completion Overview'
      },
    },
  };

  return (
    <div style={{ height: '300px', width: '300px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default TrainingOverviewPieChart;
