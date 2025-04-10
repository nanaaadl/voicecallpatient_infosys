import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import profileImage from "../assets/profile-image.jpg";

const ADMIN_BACKEND_BASE_URL = 'http://localhost:5001/api/admin';

const DashboardScreen = () => {
  const [shifts, setShifts] = useState([]);
  const [nurseData, setNurseData] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);

  useEffect(() => {
    const fetchNurseDataAndShifts = async () => {
      try {
          const storedData = await SecureStore.getItemAsync("userData");
          if (storedData) {
              const parsedData = JSON.parse(storedData);
              setNurseData(parsedData);
              fetchShifts(parsedData.nurseId); 
          }
      } catch (error) {
          console.error("Error fetching nurse data:", error);
      }
  };

  fetchNurseDataAndShifts();
}, []);

const fetchShifts = async (nurseID) => {
  if (!nurseID) {
      console.warn("Nurse ID not available to fetch shifts.");
      setShifts([]);
      return;
  }

  try {
      const response = await axios.get(`${ADMIN_BACKEND_BASE_URL}/shifts/nurse/${nurseID}/shifts`);

      if (response.data) {
          setShifts(response.data);
      } else {
          console.error("Failed to fetch shifts:", response.data.message || "Empty response");
          setShifts([]);
      }
  } catch (error) {
      console.error("Error fetching shifts from admin:", error.response ? error.response.data : error.message);
      setShifts([]);
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}> Nurse Dashboard</Text>
        <Image source={profileImage} style={styles.profileImage} />
      </View>

      <Text style={styles.welcomeText}>
      {nurseData ? `Welcome back, ${nurseData.firstName} ${nurseData.lastName}` : "Loading..."}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Shifts</Text>
        {shifts.length > 0 ? (
          shifts.map((shift, index) => (
            <Text key={index}>{new Date(shift.date).toLocaleDateString()} -{' '}
              {new Date(shift.startTime).toLocaleTimeString()} to{' '}
              {new Date(shift.endTime).toLocaleTimeString()}
            </Text>
          ))
        ) : (
          <Text style={styles.noShiftsText}>No shifts scheduled.</Text>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 36,
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#383838",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  section: {
    backgroundColor: "#EDEFFD",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 28,
    color: "#273377",
  },
  shiftText: {
    fontSize: 16,
    marginBottom: 20,
  },
  patientText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  patientSubText: {
    fontSize: 18,
    color: "gray",
    marginBottom: 30,
  },
});

export default DashboardScreen;
