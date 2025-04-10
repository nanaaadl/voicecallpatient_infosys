// import React, { useState, useEffect } from "react";
// import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";
// import axios from "axios";
// import * as SecureStore from "expo-secure-store";
// import { getNurseTasks, completeNurseTask } from '../services/NurseService';


// const GET_API_URL = "http://192.168.1.6:5000/api/nurse/getPatientRequests";
// const UPDATE_API_URL = "http://192.168.1.6:5000/api/nurse/updatePatientRequests";

// const TaskManagementScreen = ({ route }) => {
//   const [nurseData, setNurseData] = useState(null);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNurseData = async () => {
//       try {
//         const storedData = await SecureStore.getItemAsync("userData");
//         if (storedData) {
//           setNurseData(JSON.parse(storedData));
//         }
//       } catch (error) {
//         console.error("Error fetching stored nurse data:", error);
//       }
//     };

//     fetchNurseData();
//   }, []);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         if (!nurseData?._id) {
//           console.error("Nurse ID not available!");
//           return;
//         }

//         console.log("Fetching tasks for nurseID:", nurseData._id);

//         const response = await axios.get(`${GET_API_URL}?username=${nurseData.username}`);

//         console.log("API Response:", response.data);

//         if (response.data && response.data.data) {
//           setTasks(response.data.data);
//         } else {
//           console.error("No tasks found in API response.");
//         }
//       } catch (error) {
//         console.error("Error fetching tasks:", error.response ? error.response.data : error.message);
//       }
//     };

//     if (nurseData) {
//       fetchTasks();
//     }
//   }, [nurseData]);

//   const toggleTask = async (task) => {
//     console.log("Task Clicked:", task)
//     if (task.status === "completed") {
//       console.log("Task is already completed. No update needed.");
//       return;
//     }
  
//     let newStatus = task.status === "pending" ? "inProgress" : "completed";
  
//     const payload = {
//       nurseID: nurseData._id,
//       patientID: Number(task.patientID),
//       request: task.request.trim(),
//       status: newStatus
//     };
  
//     console.log("Sending update request:", payload);
  
//     try {
//       const response = await axios.put(UPDATE_API_URL, payload, {
//         headers: { "Content-Type": "application/json" },
//       });
  
//       console.log("Update Response:", response.data);
  
//       if (response.data.status === "Success") {
//         // Update tasks in state immediately
//         setTasks(prevTasks =>
//           prevTasks.map(t =>
//             t._id === task._id ? { ...t, status: newStatus } : t
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error updating task:", error.response ? error.response.data : error.message);
//     }
//   };
  
  
  

//   const pendingTasks = tasks.filter(task => task.status === "pending");
//   const inProgressTasks = tasks.filter(task => task.status === "inProgress");
//   const completedTasks = tasks.filter(task => task.status === "completed");

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Tasks Status</Text>
//         <Image source={require("../assets/profile-image.jpg")} style={styles.profileImage} />
//       </View>
  
//       <Text style={styles.welcomeText}>
//         Welcome back, {nurseData?.nurseName || "Nurse"}
//       </Text>
  
//       {/* Status Overview */}
//       <View style={styles.statusContainer}>
//         <View style={styles.statusBox}>
//           <FontAwesome name="clock-o" size={24} color="#4359d0" />
//           <Text style={styles.statusText}>Pending - {pendingTasks.length}</Text>
//         </View>
//         <View style={styles.statusBox}>
//           <FontAwesome name="arrow-right" size={24} color="#4359d0" />
//           <Text style={styles.statusText}>In-progress - {inProgressTasks.length}</Text>
//         </View>
//         <View style={styles.statusBox}>
//           <FontAwesome name="check-circle-o" size={24} color="#4359d0" />
//           <Text style={styles.statusText}>Completed - {completedTasks.length}</Text>
//         </View>
//       </View>
  
//       <ScrollView>
//         {/* Pending Tasks */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Pending Tasks</Text>
//           {pendingTasks.length > 0 ? (
//             pendingTasks.map(task => (
//               <TouchableOpacity key={task._id} style={styles.taskRow} onPress={() => toggleTask(task)}>
//                 <FontAwesome name="square-o" size={22} color="#4359d0" />
//                 <Text style={styles.taskText}>{task.request}</Text>
//               </TouchableOpacity>
//             ))
//           ) : (
//             <Text style={styles.noRequestsText}>No pending requests</Text>
//           )}
//         </View>
  
//         {/* In-progress Tasks */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>In-progress Tasks</Text>
//           {inProgressTasks.length > 0 ? (
//             inProgressTasks.map(task => (
//               <TouchableOpacity key={task._id} style={styles.taskRow} onPress={() => toggleTask(task)}>
//                 <FontAwesome name="arrow-right" size={22} color="#4359d0" />
//                 <Text style={styles.taskText}>{task.request}</Text>
//               </TouchableOpacity>
//             ))
//           ) : (
//             <Text style={styles.noRequestsText}>No in-progress requests</Text>
//           )}
//         </View>
  
//         {/* Completed Tasks */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Completed Tasks</Text>
//           {completedTasks.length > 0 ? (
//             completedTasks.map(task => (
//               <View style={styles.taskRow} key={task._id}>
//                 <FontAwesome name="check-circle" size={22} color="green" />
//                 <Text style={styles.completedTaskText}>{task.request}</Text>
//               </View>
//             ))
//           ) : (
//             <Text style={styles.noRequestsText}>No completed requests</Text>
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };
import React, { useEffect, useState } from 'react';
import { getAssignedRequests, markTaskComplete, getNurseProfile } from '../services/nurseActivitiesService';

const TaskManagementScreen = () => {
  const [nurse, setNurse] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const nurseData = await getNurseProfile();
      setNurse(nurseData);

      const assigned = await getAssignedRequests();
      setTasks(assigned);
    };
    fetchData();
  }, []);

  const handleComplete = async (requestId) => {
    await markTaskComplete(requestId);
    setTasks(tasks.filter((task) => task._id !== requestId));
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(); 
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Assigned Tasks for {nurse?.name}</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task._id} className="bg-white p-4 shadow rounded">
              <p><strong>Patient:</strong> {task.patientName}</p>
              <p><strong>Room:</strong> {task.roomNumber}</p>
              <p><strong>Condition:</strong> {task.condition}</p>
              {task.timestamp && (
                <p><strong>Assigned At:</strong> {formatDateTime(task.timestamp)}</p>
              )}
              <button
                onClick={() => handleComplete(task._id)}
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
              >
                Mark Complete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 36,
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
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 36,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  statusBox: {
    alignItems: "center",
  },
  statusText: {
    fontSize: 17,
    marginTop: 5,
  },
  section: {
    backgroundColor: "#EDEFFD",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#383838",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  taskText: {
    fontSize: 17,
    marginLeft: 10,
    color: "#383838",
  },
  checkedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  completedTaskText: {
    fontSize: 16,
    marginLeft: 10,
    color: "blue",
  },
});

export default TaskManagementScreen;
