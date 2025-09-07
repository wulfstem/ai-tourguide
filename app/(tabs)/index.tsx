import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { markers, categoryColors } from "../../assets/poi";
import { customMapStyle } from "../../assets/customMapStyle";


export default function HomeScreen() {
  const [region, setRegion] = useState<any>(null);

  useEffect(() => {
    let subscriber: Location.LocationSubscription;

    (async () => {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      // Start watching location
      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000, // update every 2s
          distanceInterval: 5, // or every 5 meters
        },
        (loc) => {
          setRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      );
    })();

    // Clean up when unmounting
    return () => {
      if (subscriber) {
        subscriber.remove();
      }
    };
  }, []);

  if (!region) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="blue" />
    </View>
  );
}

return (
  <MapView
    style={styles.map}
    region={region}
    showsUserLocation={true}
    followsUserLocation={true}
    customMapStyle={customMapStyle}
    provider={PROVIDER_GOOGLE}
  >

    {/* Render custom POI markers */}
    {markers.map((marker) => (
      <Marker
        key={marker.id}
        coordinate={{
          latitude: marker.latitude,
          longitude: marker.longitude,
        }}
        pinColor={categoryColors[marker.category]}
      >
        {/* Small dot instead of default pin */}
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
          }}
        />
        {/* Show title only when zoomed in enough */}
        {region?.latitudeDelta < 0.02 && (
          <Callout>
            <Text>{marker.title}</Text>
          </Callout>
        )}
      </Marker>
    ))}
  </MapView>
);
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
