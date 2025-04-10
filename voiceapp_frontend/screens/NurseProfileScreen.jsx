import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import profileImage from "../assets/profile-image.jpg"; // Replace with actual profile image

const NurseProfileScreen = () => {
  const navigation = useNavigation();
  const [nurseData, setNurseData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = await SecureStore.getItemAsync("userData"); // ✅ Get stored user data
        if (storedData) {
          setNurseData(JSON.parse(storedData)); // ✅ Convert JSON string to object
        } else {
          console.log("No stored user data found.");
        }
      } catch (error) {
        console.error("Error fetching stored user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("userData"); // ✅ Remove stored data on logout
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      {nurseData ? (
        <>
          <View style={styles.profileSection}>
            <Image source={profileImage} style={styles.profileImage} />
            <Text style={styles.name}>Name: {nurseData.nurseName}</Text>
            <Text style={styles.info}>Username: {nurseData.username}</Text>
            <Text style={styles.info}>Department: {nurseData.department}</Text>
            <Text style={styles.info}>Role: {nurseData.role || "Registered Nurse (RN)"}</Text>
            <Text style={styles.info}>Hospital: {nurseData.hospital || "Aster Medicity"}</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Loading nurse details...</Text>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginTop: 20,
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
    color: "#383838",
  },
  info: {
    fontSize: 16,
    color: "#3D3D3D",
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    padding: 12,
    borderRadius: 20,
    width: "40%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    alignSelf: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "bold",
  },
});

export default NurseProfileScreen;
