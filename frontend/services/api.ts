import { Platform } from 'react-native';

const API_BASE_URL = __DEV__
    ? Platform.OS === 'ios'
        ? 'http://172.20.10.3:8000'
        : 'http://localhost:8000'
    : 'https://your-production-api.com';

export interface Location {
  id: number;
  category: string;
  title: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface LocationCreate {
  category: string;
  title: string;
  latitude: number;
  longitude: number;
}

class ApiService {
  async getLocations(): Promise<Location[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/locations`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      throw error;
    }
  }

  async createLocation(location: LocationCreate): Promise<Location> {
    try {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(location),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to create location:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();