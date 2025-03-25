import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AdoreScoreGauge from './AdoreScoreGauge';
import EmotionChart from './EmotionChart';
import TopicAnalysis from './TopicAnalysis';
import { getFeedbackList, getAnalyticsSummary } from '../services/api';

const Dashboard = ({ newFeedbackData, clearNewFeedback }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  useEffect(() => {
    if (newFeedbackData) {
      setFeedbackList(prevList => [newFeedbackData, ...prevList]);
      clearNewFeedback();
    }
  }, [newFeedbackData, clearNewFeedback]);

  const fetchFeedbackData = async () => {
    setLoading(true);
    setError('');

    try {
      const [feedbackData, summaryData] = await Promise.all([
        getFeedbackList(10, 0),
        getAnalyticsSummary()
      ]);

      setFeedbackList(feedbackData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ fontFamily: '"Poppins", sans-serif',backgroundColor: '#80cbc4', p: 3,display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h1" component="h1">
          Feedback Analysis Dashboard
        </Typography>
        <Button 
          variant="contained" 
          sx={{ fontFamily: '"Poppins", sans-serif',backgroundColor: '#00897B', '&:hover': { backgroundColor: '#00695C' } }}
          startIcon={<RefreshIcon />}
          onClick={fetchFeedbackData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {summary && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h2" gutterBottom>
                Overall Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Feedback Overview
                      </Typography>
                      <Typography variant="h3">
                        {summary.total_feedback || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Feedback Records
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <AdoreScoreGauge score={summary.average_adorescore || 0} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Top Emotions
                      </Typography>
                      {summary?.emotion_distribution &&
                        Object.entries(summary.emotion_distribution)
                          .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
                          .slice(0, 3)
                          .map(([emotion, score], index) => (
                            <Box key={emotion} sx={{ mb: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body1">{emotion}</Typography>
                                <Typography variant="body2">
                                  {(score * 100).toFixed(1)}%
                                </Typography>
                              </Box>
                              {index < 2 && <Divider sx={{ my: 1 }} />}
                            </Box>
                          ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          <Typography variant="h2" gutterBottom>
            Recent Feedback Analysis
          </Typography>
          
          {feedbackList.length > 0 ? (
            feedbackList.map((feedback, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {new Date(feedback.timestamp).toLocaleString()}
                      {feedback.customer_id && ` | Customer ID: ${feedback.customer_id}`}
                    </Typography>
                    <Typography variant="body1">
                      {feedback.feedback}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <AdoreScoreGauge score={feedback.adorescore} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <EmotionChart emotions={feedback.emotions} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TopicAnalysis topics={feedback.topics} topicScores={feedback.topic_scores} />
                  </Grid>
                </Grid>
                
                {index < feedbackList.length - 1 && (
                  <Divider sx={{ my: 4 }} />
                )}
              </Box>
            ))
          ) : (
            <Alert severity="info">
              No feedback data available. Submit some feedback to get started!
            </Alert>
          )}
        </>
      )}
    </Box>
  );
};

export default Dashboard;
