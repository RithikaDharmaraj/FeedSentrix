
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InsightsIcon from '@mui/icons-material/Insights';
import FeedbackIcon from '@mui/icons-material/Feedback';
import Container from '@mui/material/Container';

const Navbar = ({ activeTab, onNavChange }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#ff6666' }}> {/* Light Red Theme */}
      <Container maxWidth="lg">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontFamily: '"Poppins", sans-serif',  
              fontWeight: 'bold' ,
              color:'black'
            }}
          >
            Customer Emotion Analysis System
          </Typography>
          <Box>
            <Button 
              color="inherit" 
              startIcon={<InsightsIcon />}
              onClick={() => onNavChange('dashboard')}
              sx={{ 
                fontFamily: '"Poppins", sans-serif', 
                fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal',
                borderBottom: activeTab === 'dashboard' ? '2px solid white' : 'none',
                borderRadius: 0,
                color: 'black', 
                '&:hover': { backgroundColor: '#ff4d4d' } 
              }}
            >
              Dashboard
            </Button>
            <Button 
              color="inherit" 
              startIcon={<FeedbackIcon />}
              onClick={() => onNavChange('feedback')}
              sx={{ 
                fontFamily: '"Poppins", sans-serif',
                fontWeight: activeTab === 'feedback' ? 'bold' : 'normal',
                borderBottom: activeTab === 'feedback' ? '2px solid white' : 'none',
                borderRadius: 0,
                color: 'black',
                '&:hover': { backgroundColor: '#ff4d4d' }
              }}
            >
              Submit Feedback
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
