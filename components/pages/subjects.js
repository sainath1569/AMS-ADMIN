import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Picker,
  Switch,
  Modal,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const branches = ["CSE", "ECE", "EEE", "CIVIL", "MECH", "CHEM", "MME"];
const years = ["E1", "E2", "E3", "E4"];

export default function SubjectsSchedulePage() {
  const [activeTab, setActiveTab] = useState("subjects");

  // --- Subjects ---
  const [subjectsList, setSubjectsList] = useState([]);
  const [showUploadSubjectsCard, setShowUploadSubjectsCard] = useState(false);
  const [replaceSubjects, setReplaceSubjects] = useState(false);

  // --- Schedule ---
  const [scheduleList, setScheduleList] = useState([]);
  const [showUploadScheduleCard, setShowUploadScheduleCard] = useState(false);
  const [scheduleBranch, setScheduleBranch] = useState("CSE");
  const [scheduleYear, setScheduleYear] = useState("E1");

  // --- Handlers ---
  const handleUploadSubjects = () => {
    const newSubject = { name: "Subjects.xlsx" };
    if (replaceSubjects) setSubjectsList([newSubject]);
    else setSubjectsList([...subjectsList, newSubject]);
    setShowUploadSubjectsCard(false);
    setReplaceSubjects(false);
  };

  const handleUploadSchedule = () => {
    const newSchedule = {
      branch: scheduleBranch,
      year: scheduleYear,
      file: "Schedule.xlsx",
    };
    setScheduleList([...scheduleList, newSchedule]);
    setShowUploadScheduleCard(false);
  };

  const handleDeleteSubject = (index) => {
    const list = [...subjectsList];
    list.splice(index, 1);
    setSubjectsList(list);
  };

  const handleDeleteSchedule = (index) => {
    const list = [...scheduleList];
    list.splice(index, 1);
    setScheduleList(list);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Subjects & Schedule Management</Text>

      {/* --- Top Tab --- */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "subjects" && styles.activeTab]}
          onPress={() => setActiveTab("subjects")}
        >
          <MaterialIcons name="menu-book" size={20} color={activeTab === "subjects" ? "#fff" : "#8B0000"} />
          <Text style={[styles.tabText, activeTab === "subjects" && { color: "#fff" }]}>Subjects</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "schedules" && styles.activeTab]}
          onPress={() => setActiveTab("schedules")}
        >
          <MaterialIcons name="schedule" size={20} color={activeTab === "schedules" ? "#fff" : "#8B0000"} />
          <Text style={[styles.tabText, activeTab === "schedules" && { color: "#fff" }]}>Schedules</Text>
        </TouchableOpacity>
      </View>

      {/* --- Subjects Panel --- */}
      {activeTab === "subjects" && (
        <View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setShowUploadSubjectsCard(true)}
          >
            <MaterialIcons name="upload-file" size={22} color="#fff" />
            <Text style={styles.primaryButtonText}>Upload Subjects</Text>
          </TouchableOpacity>

          {/* Floating Upload Subjects Card */}
          <Modal transparent visible={showUploadSubjectsCard} animationType="fade">
            <View style={styles.modalBackground}>
              <View style={styles.floatingCard}>
                <Text style={styles.cardTitle}>Upload Subjects</Text>
                <TouchableOpacity style={styles.uploadBox}>
                  <MaterialIcons name="file-upload" size={28} color="#8B0000" />
                  <Text style={styles.uploadText}>Choose Excel File</Text>
                </TouchableOpacity>
                <View style={styles.toggleRow}>
                  <Text style={styles.label}>Replace Existing Data</Text>
                  <Switch
                    value={replaceSubjects}
                    onValueChange={setReplaceSubjects}
                    trackColor={{ false: "#ccc", true: "#8B0000" }}
                    thumbColor={replaceSubjects ? "#fff" : "#8B0000"}
                  />
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={handleUploadSubjects}>
                  <Text style={styles.submitText}>Upload</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowUploadSubjectsCard(false)}
                >
                  <MaterialIcons name="close" size={22} color="#8B0000" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Subjects List */}
          <Text style={styles.sectionTitle}>Uploaded Subjects</Text>
          {subjectsList.length === 0 ? (
            <Text style={styles.noData}>No subjects uploaded.</Text>
          ) : (
            subjectsList.map((s, i) => (
              <View
                key={i}
                style={[styles.studentCard, { backgroundColor: i % 2 === 0 ? "#fff" : "#f9f9f9" }]}
              >
                <Text style={styles.studentName}>{s.name}</Text>
                <TouchableOpacity onPress={() => handleDeleteSubject(i)}>
                  <MaterialIcons name="delete" size={20} color="#B22222" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      )}

      {/* --- Schedule Panel --- */}
      {activeTab === "schedules" && (
        <View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setShowUploadScheduleCard(true)}
          >
            <MaterialIcons name="upload-file" size={22} color="#fff" />
            <Text style={styles.primaryButtonText}>Upload Schedule</Text>
          </TouchableOpacity>

          {/* Floating Upload Schedule Card */}
          <Modal transparent visible={showUploadScheduleCard} animationType="fade">
            <View style={styles.modalBackground}>
              <View style={styles.floatingCard}>
                <Text style={styles.cardTitle}>Upload Schedule</Text>

                <Text style={styles.label}>Branch</Text>
                <Picker
                  selectedValue={scheduleBranch}
                  style={styles.picker}
                  onValueChange={setScheduleBranch}
                >
                  {branches.map((b) => (
                    <Picker.Item label={b} value={b} key={b} />
                  ))}
                </Picker>

                <Text style={styles.label}>Year</Text>
                <Picker
                  selectedValue={scheduleYear}
                  style={styles.picker}
                  onValueChange={setScheduleYear}
                >
                  {years.map((y) => (
                    <Picker.Item label={y} value={y} key={y} />
                  ))}
                </Picker>

                <TouchableOpacity style={styles.uploadBox}>
                  <MaterialIcons name="file-upload" size={28} color="#8B0000" />
                  <Text style={styles.uploadText}>Choose Excel File</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitButton} onPress={handleUploadSchedule}>
                  <Text style={styles.submitText}>Upload</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowUploadScheduleCard(false)}
                >
                  <MaterialIcons name="close" size={22} color="#8B0000" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Schedule List */}
          <Text style={styles.sectionTitle}>Uploaded Schedules</Text>
          {scheduleList.length === 0 ? (
            <Text style={styles.noData}>No schedules uploaded.</Text>
          ) : (
            scheduleList.map((s, i) => (
              <View
                key={i}
                style={[styles.studentCard, { backgroundColor: i % 2 === 0 ? "#fff" : "#f9f9f9" }]}
              >
                <Text style={styles.studentName}>
                  {s.file} ({s.branch}-{s.year})
                </Text>
                <TouchableOpacity onPress={() => handleDeleteSchedule(i)}>
                  <MaterialIcons name="delete" size={20} color="#B22222" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fafafa" },
  title: { fontSize: 26, fontWeight: "bold", color: "#8B0000", marginBottom: 20 },
  tabContainer: { flexDirection: "row", marginBottom: 15 },
  tabButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8B0000",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  activeTab: { backgroundColor: "#8B0000" },
  tabText: { color: "#8B0000", fontWeight: "600" },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#8B0000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 15,
  },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  floatingCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#8B0000", marginBottom: 10 },
  label: { fontWeight: "600", color: "#444", marginBottom: 3 },
  picker: { backgroundColor: "#f3f3f3", borderRadius: 8, marginBottom: 8 },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 18,
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#fafafa",
  },
  uploadText: { marginTop: 6, color: "#8B0000", fontWeight: "500" },
  toggleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
  submitButton: { backgroundColor: "#8B0000", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 5 },
  submitText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginVertical: 10 },
  noData: { textAlign: "center", color: "#777", marginVertical: 10 },
  studentCard: { padding: 12, borderRadius: 8, marginBottom: 8, elevation: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  studentName: { fontSize: 16, fontWeight: "600", color: "#111" },
});
