import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { apiService, Location as LocationType, City as CityType } from '../services/api';

export const useMapData = () => {
  const [markers, setMarkers] = useState<LocationType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [locations, cities] = await Promise.all([
          apiService.getLocations(),
          apiService.getCities()
        ]);
        setMarkers(locations);
        setCities(cities);
        console.log(`Loaded ${locations.length} locations and ${cities.length} cities`);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load data from server');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    markers,
    cities,
    isLoading,
  };
};