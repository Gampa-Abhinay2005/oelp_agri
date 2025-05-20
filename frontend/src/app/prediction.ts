import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Make sure this is correct

// Function to get crop recommendations
export async function predict_fertilizer_and_crop(data: { temp: number; potassium: number; phosphorus: number; nitrogen: number; humidity: number; moisture: number; soil_type: number }) {
    try {
        const response = await axios.post(`${API_BASE_URL}/crop-recommendation/`, data);
        return response.data; // The recommended crop
    } catch (error) {
        console.error('Error fetching crop recommendation:', error);
        throw error;
    }
}

// Function to predict yield
export async function predictYield(data: { crop: string; state: string; district: string; area: number; season: string }) {
    try {
        const response = await axios.post(`${API_BASE_URL}/predict-yield/`, data);
        return response.data; // The predicted yield
    } catch (error) {
        console.error('Error predicting yield:', error);
        throw error;
    }
}
