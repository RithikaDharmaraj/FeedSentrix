import React from 'react';
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

const EmotionChart = ({ emotions }) => {
  if (!emotions || Object.keys(emotions).length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            Emotion Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No emotion data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  
  const labels = Object.keys(emotions);
  const data = {
    labels,
    datasets: [
      {
        label: 'Emotion Intensity',
        data: labels.map(label => emotions[label].score * 100), // Convert to percentage
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',   // joy
          'rgba(54, 162, 235, 0.5)',   // sadness
          'rgba(255, 206, 86, 0.5)',   // anger
          'rgba(75, 192, 192, 0.5)',   // fear
          'rgba(153, 102, 255, 0.5)',  // love
          'rgba(255, 159, 64, 0.5)',   // surprise
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Intensity (%)'
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };

  
  const primaryEmotion = Object.entries(emotions)
    .sort((a, b) => b[1].score - a[1].score)[0];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            Emotion Analysis
          </Typography>
          <Chip 
            label={`Primary: ${primaryEmotion[0]} (${(primaryEmotion[1].score * 100).toFixed(1)}%)`}
            color="primary"
            variant="outlined"
          />
        </Box>
        
        <Bar data={data} options={options} height={200} />
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Activation Levels:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(emotions).map(([emotion, data]) => (
              <Chip
                key={emotion}
                label={`${emotion}: ${data.activation_level}`}
                size="small"
                color={
                  data.activation_level === 'High' ? 'error' :
                  data.activation_level === 'Medium' ? 'warning' : 'success'
                }
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmotionChart;