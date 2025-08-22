import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function HomeScreen() {
  const [region, setRegion] = useState<any>(null);

  useEffect(() => {
    let subscriber: Location.LocationSubscription;

    (async () => {
      // Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
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
    >
      {/* Example marker */}
      <Marker
        coordinate={{
          latitude: region.latitude,
          longitude: region.longitude,
        }}
        title="You are here"
      />
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
