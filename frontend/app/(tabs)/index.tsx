import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, ActivityIndicator, Text, Alert, TouchableOpacity } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { categoryColors, categoryTitles } from "../../assets/categoryClrs";
import { customMapStyle } from "../../assets/customMapStyle";
import { apiService, Location as LocationType, City as CityType } from "../../services/api";

export default function HomeScreen() {
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [currentRegion, setCurrentRegion] = useState<{latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number} | null>(null);
  const [markers, setMarkers] = useState<LocationType[]>([]);
  const [cities, setCities] = useState<CityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<MapView>(null);

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

  if (isLoading || !userLocation) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  const isZoomedIn = currentRegion?.latitudeDelta ? currentRegion.latitudeDelta <= 0.3 : false;

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
        onRegionChangeComplete={(region) => setCurrentRegion(region)}
      >
        {/* City names - always visible */}
        {cities.map((city) => (
          <Marker
            key={`city-${city.id}`}
            coordinate={{
              latitude: city.latitude,
              longitude: city.longitude,
            }}
          >
            <Text style={[styles.cityText, { opacity: isZoomedIn ? 0.2 : 1.0 }]}>
              {city.title}
            </Text>
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{city.title}</Text>
                <Text style={styles.calloutSubtitle}>{city.country}</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Location markers - only when zoomed in */}
        {isZoomedIn && markers.map((marker) => (
          <Marker
            key={`location-${marker.id}`}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
          >
            <View
              style={[
                styles.markerDot,
                { backgroundColor: categoryColors[marker.category] }
              ]}
            />
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Text style={[styles.calloutCategoryTitle, {color : categoryColors[marker.category]}]}>
                  {categoryTitles[marker.category]}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      
      <TouchableOpacity style={styles.myLocationButton} onPress={goToUserLocation}>
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
  cityText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
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
  calloutSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  calloutCategoryTitle: {
    fontSize: 12,
    color: '#666',
  },
});