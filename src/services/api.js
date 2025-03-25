import axios from 'axios';


const API_BASE_URL = "http://localhost:8000";  
const API_URL = process.env.REACT_APP_API_BASE_URL;


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeFeedback = async (feedback, source = 'web', customerId = null) => {
  try {
    const response = await api.post('/analyze', {
      feedback,
      source,
      customer_id: customerId,
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing feedback:', error);
    throw error;
  }
};

export const getFeedbackList = async () => {
  try {
      const response = await axios.get(`${API_BASE_URL}/feedback?limit=10&skip=0`);
      return response.data;
  } catch (error) {
      console.error("Error fetching feedback list:", error);
      throw error;
  }
};

export const getAnalyticsSummary = async (startDate, endDate) => {
  try {
    const response = await api.post('/analytics/summary', {
      start_date: startDate,
      end_date: endDate,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    throw error;
  }
};

export default api;