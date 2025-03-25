
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Paper,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { analyzeFeedback } from '../services/api';
import { useTranslation } from 'react-i18next';
import '../i18n'; 


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff', 
    },
    secondary: {
      main: '#ff4081', 
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h4: {
      fontWeight: 700,
      color: '#ffffff',
    },
    body1: {
      color: '#b0bec5',
    },
  },
});

const FeedbackForm = ({ onFeedbackSubmitted, isLoading, setIsLoading }) => {
  const { t, i18n } = useTranslation();
  const [feedback, setFeedback] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [language, setLanguage] = useState(i18n.language);

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      setError(t('feedbackError'));
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await analyzeFeedback(feedback, 'web', customerId || null);
      onFeedbackSubmitted(result);
      setFeedback('');
      setCustomerId('');
      setError('');
      setOpenSnackbar(true);
    } catch (err) {
      setError(t('errorMessage'));
      console.error('Error submitting feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', p: 4 }}>
        
        
        <Select 
          value={language} 
          onChange={handleLanguageChange} 
          sx={{ mb: 2, backgroundColor: 'background.paper', color: 'text.primary' }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="fr">Français</MenuItem>
          <MenuItem value="es">Español</MenuItem>
        </Select>

        <Typography variant="h4" gutterBottom>
          {t('Submit Feedback')}
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: 'background.paper' }}>
  <Typography 
    variant="body1" 
    sx={{
      fontStyle: 'italic', 
      fontSize: '1.1rem', 
      color: '#ff5252', 
      fontFamily: '"Georgia", serif', 
    }}
  >
    We value your feedback! Please share your thoughts, experiences, or suggestions with us.
    Our emotion analysis system will process your feedback to help us improve our services.
  </Typography>
</Paper>

        
        <Card sx={{ backgroundColor: 'background.paper' }}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label={t('yourFeedback')}
                variant="outlined"
                multiline
                rows={6}
                fullWidth
                margin="normal"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                error={!!error}
                helperText={error}
                disabled={isLoading}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'text.primary',
                    backgroundColor: 'background.default',
                    '& fieldset': { borderColor: 'primary.main' },
                    '&:hover fieldset': { borderColor: 'secondary.main' },
                  },
                }}
              />
              
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    backgroundColor: '#00e5ff', 
                    color: '#003c8f', 
                    fontWeight: 'bold',
                    fontSize: '16px',
                    padding: '12px 24px',
                    '&:hover': {
                      backgroundColor: '#00b8d4', 
                    },
                  }}
                >
                  {isLoading ? t('analyzing') : t('Submit Feedback')}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Snackbar 
          open={openSnackbar} 
          autoHideDuration={6000} 
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="success">
            {t('successMessage')}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default FeedbackForm;
