import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import profileImage from "../assets/profile-image.jpg";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

// API Base URL
const API_URL = "http://10.0.2.2:5000/api/patient/getPatients";

const PatientRecordsScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Nurse ID from Secure Storage
  useEffect(() => {
    const fetchNurseData = async () => {
      try {
        const storedUserData = await SecureStore.getItemAsync("userData");
        console.log("Nurse Data:", storedUserData);
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          if (parsedData && parsedData._id) {
            fetchPatients(parsedData._id);
          }
        }
      } catch (error) {
        console.error("Error fetching nurse data from SecureStore:", error);
      }
    };
    fetchNurseData();
  }, []);

  // Fetch patients from API
  const fetchPatients = async (nurseID) => {
    try {
      console.log("Fetching patients for NurseID:", nurseID);
      setLoading(true);
      const response = await fetch(`${API_URL}?nurseId=${nurseID}`);
      const data = await response.json();
      setLoading(false);
      if (data.status === "Success" && Array.isArray(data.data)) {
        setPatients(data.data);
        setFilteredPatients(data.data);
      } else {
        setPatients([]);
        setFilteredPatients([]);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching patients:", error);
    }
  };

  // Search function (using patientID)
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === "") {
      setFilteredPatients(patients);
    } else {
      const filteredData = patients.filter((patient) =>
        String(patient.patientID).includes(text)
      );
      setFilteredPatients(filteredData);
    }
  };

  // Save patient details to Secure Storage and navigate
  const savePatientDetails = async (patient) => {
    try {
      await SecureStore.setItemAsync("selectedPatient", JSON.stringify(patient));
      navigation.navigate("RecordDetails", { patient });
    } catch (error) {
      console.error("Error saving patient data to SecureStore:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Patient Records</Text>
        <TouchableOpacity>
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Patient ID..."
          value={searchQuery}
          onChangeText={handleSearch}
          keyboardType="numeric"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={20} color="gray" style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => String(item.patientID)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => savePatientDetails(item)}>
              <Ionicons name="person-outline" size={24} color="black" />
              <View style={styles.info}>
                <Text style={styles.name}>ID: {item.patientID}, Room: {item.room}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.contact}>📞 {item.phone}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.noResults}>No patients found</Text>
          )}
        />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  title: {
    fontSize: 29,
    fontWeight: "bold",
    color: "#383838",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#edeffd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  clearIcon: {
    marginLeft: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEFFD",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  info: {
    marginLeft: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
  },
  description: {
    fontSize: 15,
    color: "#383838",
    marginTop: 5,
    marginBottom: 4,
  },
  contact: {
    fontSize: 15,
    color: "#007AFF",
    marginTop: 4,
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});

export default PatientRecordsScreen;
