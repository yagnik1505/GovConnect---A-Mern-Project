import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { api } from '../utils/api';

// Import Chart.js components individually
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CrisisStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCrisisStats();
  }, []);

  const fetchCrisisStats = async () => {
    try {
      setLoading(true);
      const { res, data } = await api('/api/crises/stats');
      
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to fetch crisis statistics');
      }
      
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching crisis stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getCategoryColor = (category) => {
    const colors = {
      infrastructure: '#FF6384',
      health: '#36A2EB',
      safety: '#FFCE56',
      environment: '#4BC0C0',
      other: '#9966FF'
    };
    return colors[category] || '#FF6384';
  };

  if (loading) {
    return (
      <div className="crisis-stats-container">
        <div className="loading">Loading crisis statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="crisis-stats-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!stats || stats.totalCrises === 0) {
    return (
      <div className="crisis-stats-container">
        <div className="no-data">No crisis data available</div>
      </div>
    );
  }

  // Prepare data for crisis type chart
  const crisisTypeData = {
    labels: stats.crisisTypes.map(item => formatCategoryName(item._id)),
    datasets: [
      {
        label: 'Number of Crises',
        data: stats.crisisTypes.map(item => item.count),
        backgroundColor: stats.crisisTypes.map(item => getCategoryColor(item._id)),
        borderColor: stats.crisisTypes.map(item => getCategoryColor(item._id)),
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for solved/unsolved chart
  const solvedData = {
    labels: stats.solvedStatus.map(item => 
      item._id === 'completed' ? 'Solved' : 'Pending'
    ),
    datasets: [
      {
        data: stats.solvedStatus.map(item => item.count),
        backgroundColor: ['#4BC0C0', '#FF6384'],
        borderColor: ['#4BC0C0', '#FF6384'],
        borderWidth: 1,
      },
    ],
  };

  const crisisTypeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Crisis Types Distribution',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
  };

  const solvedOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Crisis Resolution Status',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
  };

  return (
    <div className="crisis-stats-container">
      <div className="stats-header">
        <h2>Crisis Statistics Dashboard</h2>
        <div className="total-crises">
          Total Crises Reported: <strong>{stats.totalCrises}</strong>
        </div>
      </div>
      
      <div className="charts-grid">
        <div className="chart-container">
          <Bar data={crisisTypeData} options={crisisTypeOptions} />
        </div>
        
        <div className="chart-container">
          <Doughnut data={solvedData} options={solvedOptions} />
        </div>
      </div>

      <div className="stats-summary">
        <div className="summary-item">
          <h3>Most Common Crisis Type</h3>
          <p>
            {stats.crisisTypes.length > 0 
              ? `${formatCategoryName(stats.crisisTypes[0]._id)} (${stats.crisisTypes[0].count} cases)`
              : 'No data available'
            }
          </p>
        </div>
        
        <div className="summary-item">
          <h3>Resolution Rate</h3>
          <p>
            {(() => {
              const completed = stats.solvedStatus.find(s => s._id === 'completed')?.count || 0;
              const pending = stats.solvedStatus.find(s => s._id === 'pending')?.count || 0;
              const total = completed + pending;
              const rate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
              return `${rate}% (${completed}/${total})`;
            })()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrisisStats;
