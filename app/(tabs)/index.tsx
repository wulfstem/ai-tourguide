import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, ActivityIndicator, Text, Alert, TouchableOpacity } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Region } from "react-native-maps";
import * as Location from "expo-location";
import { categoryColors } from "../../assets/categoryClrs";
import { customMapStyle } from "../../assets/customMapStyle";
import { apiService, Location as LocationType } from "../../services/api";

export default function HomeScreen() {
  // Remove region state, use only userLocation
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [markers, setMarkers] = useState<LocationType[]>([]);
  const [isLoadingMarkers, setIsLoadingMarkers] = useState(true);
  const mapRef = useRef<MapView>(null);

  // Fetch locations from backend
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoadingMarkers(true);
        const locations = await apiService.getLocations();
        setMarkers(locations);
        console.log(`Loaded ${locations.length} locations from backend`);
      } catch (error) {
        console.error('Error fetching locations:', error);
        Alert.alert('Error', 'Failed to load locations from server');
      } finally {
        setIsLoadingMarkers(false);
      }
    };

    fetchLocations();
  }, []);

  // Get user location
  useEffect(() => {
    let subscriber: Location.LocationSubscription;
    (async () => {
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
      // Watch location
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
    })();
    return () => {
      if (subscriber) subscriber.remove();
    };
  }, []);

  // Function to go back to user location
  const goToUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  } 

  // Show loading while markers or userLocation are loading
  if (isLoadingMarkers || !userLocation) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        followsUserLocation={false}
        customMapStyle={customMapStyle}
        provider={PROVIDER_GOOGLE}
      >
        {/* Render markers from backend */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
          >
            {/* Custom marker view */}
            <View
              style={[
                styles.markerDot,
                { backgroundColor: categoryColors[marker.category] || 'red' }
              ]}
            />
            {/* Always show callout when marker is pressed */}
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Text style={styles.calloutCategory}>Category: {marker.category}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      {/* My Location Button */}
      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={goToUserLocation}
      >
        <Text style={styles.buttonText}>📍</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 24,
  },
  calloutContainer: {
    padding: 10,
    minWidth: 120,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutCategory: {
    fontSize: 12,
    color: '#666',
  },
});