import axios from 'axios';

// Create axios instance
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    timeout: 10000,
});

// Health check
export const checkHealth = async () => {
    try {
        const response = await API.get('/api/health');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get all cities
export const getCities = async () => {
    try {
        const response = await API.get('/api/cities');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get city air quality data
export const getCityData = async (cityId) => {
    try {
        const response = await API.get(`/api/city_data?cityId=${cityId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get AQI prediction
export const getPrediction = async (cityId, cityName) => {
    try {
        const response = await API.get(`/api/predict?cityId=${cityId}&cityName=${cityName}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get model info
export const getModelInfo = async () => {
    try {
        const response = await API.get('/api/model/info');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default API;