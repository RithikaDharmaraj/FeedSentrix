import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import GaugeChart from 'react-gauge-chart';

const AdoreScoreGauge = ({ score }) => {
  
  const normalizedScore = (score + 100) / 200;
  
  
  const getColor = () => {
    if (score < -50) return '#d32f2f'; 
    if (score < 0) return '#f57c00';   
    if (score < 50) return '#4caf50';  
    return '#2196f3';                  
  };

 
  const getSentimentLabel = () => {
    if (score < -50) return 'Very Negative';
    if (score < -20) return 'Negative';
    if (score < 20) return 'Neutral';
    if (score < 50) return 'Positive';
    return 'Very Positive';
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom align="center">
          AdoreScore
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <GaugeChart
            id="adore-score-gauge"
            nrOfLevels={5}
            percent={normalizedScore}
            colors={['#d32f2f', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3']}
            arcWidth={0.3}
            textColor="#000000"
            needleColor="#757575"
            needleBaseColor="#757575"
            animate={true}
          />
        </Box>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="h4" component="div" sx={{ color: getColor() }}>
            {score}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {getSentimentLabel()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdoreScoreGauge;