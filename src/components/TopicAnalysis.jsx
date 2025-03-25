import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  Divider
} from '@mui/material';

const TopicAnalysis = ({ topics, topicScores }) => {
  if (!topics || Object.keys(topics).length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            Topic Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No topic data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

 
  const getScoreColor = (score) => {
    if (score < -50) return '#d32f2f'; 
    if (score < 0) return '#f57c00';   
    if (score < 50) return '#4caf50';  
    return '#2196f3';                  
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Topic Analysis
        </Typography>
        
        <List>
          {Object.entries(topics).map(([category, subtopics], index) => (
            <React.Fragment key={category}>
              {index > 0 && <Divider sx={{ my: 1 }} />}
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" component="div">
                        {category}
                      </Typography>
                      {topicScores && topicScores[category] !== undefined && (
                        <Chip 
                          label={`Score: ${topicScores[category]}`}
                          size="small"
                          sx={{ 
                            backgroundColor: getScoreColor(topicScores[category]),
                            color: 'white'
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" component="span">
                        Subtopics:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {subtopics.map((subtopic, i) => (
                          <Chip
                            key={i}
                            label={subtopic}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default TopicAnalysis;