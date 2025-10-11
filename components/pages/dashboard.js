import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Dimensions, Switch } from "react-native";
import { useRouter } from "expo-router"; // <-- Import router
import StudentManagement from "./student";
import FacultyPage from "./faculty";
import SubjectsSchedulePage from "./subjects";
import AttendanceReport from "./reports";

import { BarChart, PieChart, LineChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

const branchesData = [
  { name: "CS", attendance: 92, students: 200 },
  { name: "ECE", attendance: 87, students: 180 },
  { name: "EEE", attendance: 85, students: 150 },
  { name: "CIVIL", attendance: 80, students: 170 },
  { name: "MECH", attendance: 78, students: 160 },
  { name: "CHEM", attendance: 88, students: 140 },
  { name: "MME", attendance: 82, students: 120 },
];

const COLORS = ["#8B0000", "#FF6347", "#FFD700", "#32CD32", "#6A5ACD", "#FF69B4", "#20B2AA"];

export default function AdminDashboard() {
  const router = useRouter(); // <-- Initialize router
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogout = () => {
    router.push("/admin/login"); // Redirect to login
  };

  const backgroundColor = isDarkMode ? "#121212" : "#f5f5f5";
  const textColor = isDarkMode ? "#f5f5f5" : "#333";
  const cardColor = isDarkMode ? "#1E1E1E" : "#fff";

  // Chart Data
  const barData = {
    labels: branchesData.map((b) => b.name),
    datasets: [{ data: branchesData.map((b) => b.attendance) }],
  };

  const pieData = branchesData.map((b, i) => ({
    name: b.name,
    population: b.students,
    color: COLORS[i % COLORS.length],
    legendFontColor: textColor,
    legendFontSize: 14,
  }));

  const lineData = {
    labels: branchesData.map((b) => b.name),
    datasets: [{ data: branchesData.map((b) => b.students), strokeWidth: 2 }],
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Navbar */}
      <View style={[styles.navbar, { backgroundColor: "#8B0000" }]}>
        <View style={styles.navLeft}>
          <Image source={require("../../assets/images/RGUKTLOGO.png")} style={styles.logo} />
          <Text style={styles.navTitle}>AMS ADMIN Portal</Text>
        </View>

        <View style={styles.navRight}>
          <Text style={{ color: "#fff", marginRight: 10 }}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
          
          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={[styles.tabContainer, { backgroundColor: cardColor }]}>
        {["Dashboard", "Students", "Faculty", "Subjects", "Reports"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, { backgroundColor: activeTab === tab ? "#8B0000" : "#ddd" }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={{ color: activeTab === tab ? "#fff" : "#333", fontWeight: "bold" }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === "Dashboard" && (
          <>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Dashboard Overview</Text>

            {/* Info Cards */}
            <View style={styles.cardContainer}>
              <View style={[styles.card, { backgroundColor: cardColor }]}>
                <Text style={[styles.cardTitle, { color: textColor }]}>Total Students</Text>
                <Text style={[styles.cardValue, { color: "#8B0000" }]}>1240</Text>
              </View>
              <View style={[styles.card, { backgroundColor: cardColor }]}>
                <Text style={[styles.cardTitle, { color: textColor }]}>Total Faculty</Text>
                <Text style={[styles.cardValue, { color: "#8B0000" }]}>85</Text>
              </View>
              <View style={[styles.card, { backgroundColor: cardColor }]}>
                <Text style={[styles.cardTitle, { color: textColor }]}>CRs Assigned</Text>
                <Text style={[styles.cardValue, { color: "#8B0000" }]}>48</Text>
              </View>
            </View>

            {/* Charts */}
            <Text style={[styles.sectionTitle, { color: textColor }]}>Attendance Analytics</Text>
            <BarChart
              data={barData}
              width={width - 40}
              height={220}
              fromZero
              chartConfig={{
                backgroundColor: cardColor,
                backgroundGradientFrom: cardColor,
                backgroundGradientTo: cardColor,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(139,0,0,${opacity})`,
                labelColor: (opacity = 1) => textColor,
              }}
              style={{ borderRadius: 12 }}
            />

            <Text style={[styles.sectionTitle, { color: textColor }]}>Branch Student Distribution</Text>
            <PieChart
              data={pieData}
              width={width - 40}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(139,0,0,${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />

            <Text style={[styles.sectionTitle, { color: textColor }]}>Enrollment Trend</Text>
            <LineChart
              data={lineData}
              width={width - 40}
              height={220}
              chartConfig={{
                backgroundColor: cardColor,
                backgroundGradientFrom: cardColor,
                backgroundGradientTo: cardColor,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(139,0,0,${opacity})`,
                labelColor: (opacity = 1) => textColor,
              }}
              bezier
              style={{ borderRadius: 12 }}
            />
          </>
        )}

        {activeTab === "Students" && <StudentManagement />}
        {activeTab === "Faculty" && <FacultyPage />}
        {activeTab === "Subjects" && <SubjectsSchedulePage />}
        {activeTab === "Reports" && <AttendanceReport />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  navbar: { height: 60, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 },
  navLeft: { flexDirection: "row", alignItems: "center" },
  logo: { width: 40, height: 40, marginRight: 10 },
  navTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  navRight: { flexDirection: "row", alignItems: "center" },
  logoutBtn: { marginLeft: 15, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: "#FF6347", borderRadius: 6 },
  logoutText: { color: "#fff", fontWeight: "bold" },
  tabContainer: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 2 } },
  tabButton: { flex: 1, marginHorizontal: 5, paddingVertical: 8, borderRadius: 6, alignItems: "center" },
  content: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 15 },
  cardContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  card: { flex: 1, borderRadius: 10, padding: 20, marginHorizontal: 5, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  cardTitle: { fontSize: 14, marginBottom: 5 },
  cardValue: { fontSize: 22, fontWeight: "bold" },
});
