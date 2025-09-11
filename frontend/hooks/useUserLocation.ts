// hooks/useUserLocation.ts
import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const mapRef = useRef<MapView>(null);

  // Get user location
  useEffect(() => {
    let subscriber: Location.LocationSubscription;
    
    const setupLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      // Watch location changes
      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5,
        },
        (loc) => {
          setUserLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        }
      );
    };

    setupLocation();

    return () => {
      if (subscriber) subscriber.remove();
    };
  }, []);

  // Function to animate to user location
  const goToUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  };

  // Function to animate to any location (city or user)
  const navigateToLocation = (latitude: number, longitude: number, zoomLevel: number = 0.05) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: zoomLevel,
        longitudeDelta: zoomLevel,
      }, 1000);
    }
  };

  return {
    userLocation,
    goToUserLocation,
    navigateToLocation,
    mapRef, // Also return mapRef since goToUserLocation needs it
  };
};