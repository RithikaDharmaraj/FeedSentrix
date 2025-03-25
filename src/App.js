import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import FeedbackForm from './components/FeedbackForm';
import './styles.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.2rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [feedbackData, setFeedbackData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFeedbackSubmitted = (data) => {
    setFeedbackData(data);
    setActiveTab('dashboard');
  };

  const handleNavChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar activeTab={activeTab} onNavChange={handleNavChange} />
        <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
          {activeTab === 'dashboard' && (
            <Dashboard 
              newFeedbackData={feedbackData} 
              clearNewFeedback={() => setFeedbackData(null)} 
            />
          )}
          {activeTab === 'feedback' && (
            <FeedbackForm 
              onFeedbackSubmitted={handleFeedbackSubmitted} 
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;