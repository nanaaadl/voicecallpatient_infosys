import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Import Screens
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import TaskManagementScreen from "../screens/TaskManagementScreen";
import PatientRecordsScreen from "../screens/PatientRecordsScreen";
import RecordDetailsScreen from "../screens/RecordDetailsScreen";
import NurseProfileScreen from "../screens/NurseProfileScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Fix: Ensure userData is properly received and passed
const PatientStack = ({ route }) => {
  const userData = route.params?.userData || {}; // Default to empty object to prevent undefined errors

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PatientRecords">
        {(props) => <PatientRecordsScreen {...props} userData={userData} />}
      </Stack.Screen>
      <Stack.Screen name="RecordDetails">
        {(props) => <RecordDetailsScreen {...props} userData={userData} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// ✅ Fix: Ensure userData is passed down correctly
const BottomTabNavigator = ({ route }) => {
  const userData = route.params?.userData || {}; // Prevent undefined errors

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Dashboard") iconName = "home-outline";
          else if (route.name === "Tasks") iconName = "list-outline";
          else if (route.name === "Patients") iconName = "people-outline";
          else if (route.name === "Profile") iconName = "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4A63E7",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Dashboard">
        {(props) => <DashboardScreen {...props} userData={userData} />}
      </Tab.Screen>
      <Tab.Screen name="Tasks">
        {(props) => <TaskManagementScreen {...props} userData={userData} />}
      </Tab.Screen>
      <Tab.Screen name="Patients">
        {(props) => <PatientStack {...props} userData={userData} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {(props) => <NurseProfileScreen {...props} userData={userData} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// ✅ Fix: Extract userData safely and pass it down
const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main">
        {(props) => {
          const userData = props.route.params?.userData || {}; // Default to empty object
          return <BottomTabNavigator {...props} route={{ params: { userData } }} />;
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AppNavigator;
