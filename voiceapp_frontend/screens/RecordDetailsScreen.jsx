import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import profileImage from "../assets/profile-PATIENT.png";

const API_BASE_URL = "http://10.0.2.2:5000/api/patient"; 

const RecordDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { patient } = route.params;

  const [requests, setRequests] = useState([]);
  const [nurseNames, setNurseNames] = useState({}); // Store nurse names by nurseID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!patient?.patientID) {
        console.error("❌ patientID is missing in frontend");
        setError("Patient ID is missing.");
        setLoading(false);
        return;
      }

      console.log("🔍 Fetching requests for patientID:", patient.patientID);

      try {
        const response = await axios.get(`${API_BASE_URL}/requests?patientID=${patient.patientID}`);

        if (response.data.status === "Success" && response.data.data.requests.length > 0) {
          setRequests(response.data.data.requests);
          fetchNurseNames(response.data.data.requests); // Fetch nurse names after getting requests
        } else {
          setError("No requests found.");
        }
      } catch (error) {
        console.error("❌ Error fetching requests:", error.response?.data || error.message);
        setError("Error fetching requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [patient]);

  const fetchNurseNames = async (requests) => {
    const uniqueNurseIDs = [...new Set(requests.map((req) => req.nurseID))]; // Get unique nurse IDs

    try {
      const nurseNameMap = {};
      await Promise.all(
        uniqueNurseIDs.map(async (nurseID) => {
          try {
            const nurseResponse = await axios.get(`http://192.168.1.6:5000/api/patient/nurses/${nurseID}`);
            nurseNameMap[nurseID] = nurseResponse.data?.data?.username || "Unknown Nurse";
          } catch (err) {
            console.error(`❌ Error fetching nurse ${nurseID}:`, err.response?.data || err.message);
            nurseNameMap[nurseID] = "Unknown Nurse";
          }
        })
      );

      setNurseNames(nurseNameMap);
    } catch (error) {
      console.error("❌ Error fetching nurse names:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Records Management</Text>
        <Ionicons name="ellipsis-vertical" size={24} color="black" />
      </View>

      {/* Patient Info */}
      <View style={styles.patientInfo}>
        <Image source={profileImage} style={styles.profileImage} />
        <Text style={styles.patientName}>{patient.name}</Text>
        <Text style={styles.patientDetails}>Patient ID: {patient.patientID}</Text>
        <Text style={styles.patientDetails}>
          DOB: {patient.dob || "Unknown"} | Sex: {patient.sex || "Unknown"}
        </Text>
        <Text style={styles.admittedFor}>
          <Text style={styles.boldText}>Admitted for: </Text>
          {patient.description || "No description provided"}
        </Text>
      </View>

      {/* Nurse Interactions */}
      <Text style={styles.sectionTitle}>NURSE INTERACTION</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            console.log("🩺 Nurse ID retrieved:", item.nurseID); // Debugging log

            return (
              <View style={styles.interactionCard}>
                <View style={styles.interactionRow}>
                  <Ionicons name="time-outline" size={20} color="#007AFF" />
                  <Text style={styles.interactionDate}>
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.nurseName}>
                    {nurseNames[item.nurseID] || "Loading..."}
                  </Text>
                </View>
                <Text style={styles.interactionAction}>{item.request}</Text>
              </View>
            );
          }}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  patientInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  patientName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  patientDetails: {
    fontSize: 16,
    color: "gray",
    marginTop: 2,
  },
  admittedFor: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
  },
  boldText: {
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  interactionCard: {
    backgroundColor: "#EDEFFD",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  interactionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  interactionDate: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  nurseName: {
    fontSize: 16,
    marginLeft: 10,
  },
  interactionAction: {
    fontSize: 15,
    color: "#383838",
  },
});

export default RecordDetailsScreen;
