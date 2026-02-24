import { Tabs } from "expo-router";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons"; // Import icons
import { useState } from "react";
import { useNavigation } from "expo-router";
import * as Updates from 'expo-updates';

export default function Layout() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // Function to reload the app
  const reloadApp = async() => {
    setLoading(true);
    await Updates.reloadAsync(); 
    setTimeout(() => {
    //   RNRestart.Restart();
      // ✅ This restarts the entire app
    }, 1000); // Simulated delay for effect// Simulating a delay for reload effect
  };

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#4CAF50", // Green header
          height: 80, // Increase height
        },
        headerTitle: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* <Image
              source={require("../../assets/images/react-logo.png")} // Update with your logo
              style={{ width: 40, height: 40, marginRight: 10 }}
            /> */}
            <Text style={{ fontSize: 22, fontWeight: "bold", color: "white" }}>
              🌿GrowPure
            </Text>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 15 }} onPress={reloadApp}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <MaterialIcons name="refresh" size={24} color="white" />
            )}
          </TouchableOpacity>
        ),
        tabBarStyle: {
          backgroundColor: "#4CAF50", // Change tab bar background color
          height: 60, // Increase tab bar height
        },
        tabBarActiveTintColor: "white", // Active icon color
        tabBarInactiveTintColor: "#d0d0d0", // Inactive icon color
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="info-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user-circle-o" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Map"
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user-circle-o" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
