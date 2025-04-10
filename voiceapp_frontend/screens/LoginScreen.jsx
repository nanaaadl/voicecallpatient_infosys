import React, { useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // ✅ Import navigation hook

const API_URL = "http://10.0.2.2:5000/api/user/verifyUser"; 

const LoginScreen = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation(); // ✅ Ensure navigation is available

  const handleSubmit = async () => {
    try {
      const response = await axios.post(API_URL, { username, password });

      console.log("Full API Response:", response.data); // ✅ Debugging API response

      if (response.status === 200 && response.data.user) {
        const userData = response.data.user; // ✅ Ensure correct data is accessed
        await SecureStore.setItemAsync("userData", JSON.stringify(userData));


        if (response.data.shifts) {
          await SecureStore.setItemAsync("nurseShifts", JSON.stringify(response.data.shifts));
      } else {
          await SecureStore.deleteItemAsync("nurseShifts");
      }
        // ✅ Set user in state (if passed as prop)
        if (setUser) setUser(userData);

        Alert.alert("Success", "Login successful");

        // ✅ Navigate to Main screen with userData
        navigation.replace("Main", { userData });
      } else {
        Alert.alert("Error", "Unexpected response from server");
      }
    } catch (error) {
      console.log("Login Error:", error.response?.data || error.message);
      Alert.alert("Error", "User not found or incorrect details");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Access Account</Text>
      <Text style={styles.subtitle}>
        Please enter your credentials to access the system
      </Text>

      {/* Username Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 220,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: -50,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 40,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#edeffd",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 15,
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4A63E7",
    paddingVertical: 12,
    borderRadius: 20,
    width: "40%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default LoginScreen;
