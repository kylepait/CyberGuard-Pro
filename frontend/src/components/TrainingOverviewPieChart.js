// trainingOverviewPieChart.js
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const TrainingOverviewPieChart = ({ trainingData }) => {
  const [pieChartData, setPieChartData] = useState({
    labels: ['Completed Trainings', 'Assigned Trainings'],
    datasets: [{
      data: [0, 0], // Placeholder data
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1,
    }],
  });

  useEffect(() => {
    const totalCompleted = trainingData.reduce((acc, curr) => acc + curr.completedCount, 0);
    const totalAssigned = trainingData.reduce((acc, curr) => acc + curr.assignedCount, 0);

    setPieChartData(prevState => ({
      ...prevState,
      datasets: [{
        ...prevState.datasets[0],
        data: [totalCompleted, totalAssigned],
      }]
    }));
  }, [trainingData]);

  return (
    <div style={{alignItems:'center', justifyContent: 'center', width: '400px', height: '400px' }}>
      <Pie data={pieChartData} />
    </div>
  );
  
};

export default TrainingOverviewPieChart;
