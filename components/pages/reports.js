import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Picker,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const branches = ["CSE", "ECE", "EEE", "CIVIL", "MECH", "CHEM", "MME"];
const batches = ["E1", "E2", "E3", "E4"];

export default function AttendanceReport() {
  const [branch, setBranch] = useState("CSE");
  const [batch, setBatch] = useState("E1");
  const [viewType, setViewType] = useState("single"); // single or range
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showSinglePicker, setShowSinglePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Mock attendance data
  const [attendanceData, setAttendanceData] = useState([
    { date: "2025-10-01", subject: "Math", total: 50, present: 45 },
    { date: "2025-10-02", subject: "Physics", total: 50, present: 48 },
    { date: "2025-10-03", subject: "Chemistry", total: 50, present: 42 },
  ]);

  const handleViewAttendance = () => {
    alert("Displaying attendance report for selected filters");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Attendance Reports</Text>

      {/* Filters Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Filters</Text>

        {/* Branch */}
        <Text style={styles.label}>Branch</Text>
        <Picker
          selectedValue={branch}
          style={styles.picker}
          onValueChange={(v) => setBranch(v)}
        >
          {branches.map((b) => (
            <Picker.Item label={b} value={b} key={b} />
          ))}
        </Picker>

        {/* Batch */}
        <Text style={styles.label}>Batch/Year</Text>
        <Picker
          selectedValue={batch}
          style={styles.picker}
          onValueChange={(v) => setBatch(v)}
        >
          {batches.map((b) => (
            <Picker.Item label={b} value={b} key={b} />
          ))}
        </Picker>

        {/* View Type */}
        <Text style={styles.label}>View Type</Text>
        <View style={styles.viewTypeRow}>
          <TouchableOpacity
            style={[
              styles.viewTypeButton,
              viewType === "single" && styles.activeViewType,
            ]}
            onPress={() => setViewType("single")}
          >
            <Text
              style={[
                styles.viewTypeText,
                viewType === "single" && { color: "#fff" },
              ]}
            >
              Single Date
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewTypeButton,
              viewType === "range" && styles.activeViewType,
            ]}
            onPress={() => setViewType("range")}
          >
            <Text
              style={[
                styles.viewTypeText,
                viewType === "range" && { color: "#fff" },
              ]}
            >
              Date Range
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        {viewType === "single" ? (
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowSinglePicker(true)}
          >
            <MaterialIcons name="calendar-today" size={20} color="#fff" />
            <Text style={styles.dateText}>{date.toDateString()}</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={styles.dateText}>{startDate.toDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.dateText}>{endDate.toDateString()}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Date Picker Modals */}
        <DateTimePickerModal
          isVisible={showSinglePicker}
          mode="date"
          date={date}
          onConfirm={(selectedDate) => {
            setDate(selectedDate);
            setShowSinglePicker(false);
          }}
          onCancel={() => setShowSinglePicker(false)}
        />
        <DateTimePickerModal
          isVisible={showStartPicker}
          mode="date"
          date={startDate}
          onConfirm={(selectedDate) => {
            setStartDate(selectedDate);
            setShowStartPicker(false);
          }}
          onCancel={() => setShowStartPicker(false)}
        />
        <DateTimePickerModal
          isVisible={showEndPicker}
          mode="date"
          date={endDate}
          onConfirm={(selectedDate) => {
            setEndDate(selectedDate);
            setShowEndPicker(false);
          }}
          onCancel={() => setShowEndPicker(false)}
        />

        {/* View Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleViewAttendance}>
          <Text style={styles.submitText}>View Attendance</Text>
        </TouchableOpacity>
      </View>

      {/* Attendance Summary */}
      <Text style={styles.sectionTitle}>Attendance Summary</Text>
      <Text style={styles.infoText}>
        Total Scheduled Classes: {attendanceData.length}
      </Text>

      {/* Class-wise Attendance Cards */}
      {attendanceData.map((cls, i) => (
        <View
          key={i}
          style={[
            styles.card,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
        >
          <View>
            <Text style={styles.studentName}>{cls.subject}</Text>
            <Text style={styles.studentDetails}>Date: {cls.date}</Text>
            <Text style={styles.studentDetails}>
              Present: {cls.present} / Total: {cls.total}
            </Text>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="visibility" size={24} color="#8B0000" />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fafafa" },
  title: { fontSize: 26, fontWeight: "bold", color: "#8B0000", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#8B0000", marginBottom: 10 },
  label: { fontWeight: "600", color: "#444", marginTop: 8, marginBottom: 5 },
  picker: { backgroundColor: "#f3f3f3", borderRadius: 8, marginBottom: 10 },
  viewTypeRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  viewTypeButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#8B0000",
    borderRadius: 8,
    alignItems: "center",
  },
  activeViewType: { backgroundColor: "#8B0000" },
  viewTypeText: { color: "#8B0000", fontWeight: "600" },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#8B0000",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateText: { color: "#fff", fontWeight: "600" },
  submitButton: { backgroundColor: "#8B0000", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 5 },
  submitText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginVertical: 10 },
  infoText: { color: "#555", marginBottom: 10 },
  studentName: { fontSize: 16, fontWeight: "600", color: "#111" },
  studentDetails: { color: "#555", fontSize: 14 },
});
