import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Picker,
  Switch,
  Alert,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const branches = ["CSE", "ECE", "EEE", "CIVIL", "MECH", "CHEM", "MME"];
const years = ["E1", "E2", "E3", "E4"];

export default function StudentCRPage() {
  const [activeTab, setActiveTab] = useState("students");

  // --- Students State ---
  const [studentList, setStudentList] = useState([]);
  const [studentBranch, setStudentBranch] = useState("CSE");
  const [studentYear, setStudentYear] = useState("E1");
  const [replaceStudents, setReplaceStudents] = useState(false);
  const [studentFilters, setStudentFilters] = useState({ branch: "All", year: "All" });
  const [showStudentCard, setShowStudentCard] = useState(false);

  // --- CRs State ---
  const [crList, setCrList] = useState([]);
  const [crBranch, setCrBranch] = useState("CSE");
  const [crYear, setCrYear] = useState("E1");
  const [crId, setCrId] = useState("");
  const [crMobile, setCrMobile] = useState("");
  const [replaceCRs, setReplaceCRs] = useState(false);
  const [showCrUploadCard, setShowCrUploadCard] = useState(false);
  const [showCrAddCard, setShowCrAddCard] = useState(false);

  // --- Handlers ---
  const handleAddStudents = () => {
    if (replaceStudents) {
      setStudentList([{ branch: studentBranch, year: studentYear, name: "New Excel Batch" }]);
    } else {
      setStudentList([
        ...studentList,
        { branch: studentBranch, year: studentYear, name: "Student Batch" },
      ]);
    }
    setShowStudentCard(false);
    alert("Student data added successfully!");
  };

  const handleAddCR = () => {
    if (!crId || !crMobile) {
      alert("Please fill ID and Mobile Number!");
      return;
    }
    const newCR = {
      id: crId,
      mobile: crMobile,
      branch: crBranch,
      year: crYear,
      name: "CR Name",
    };
    if (replaceCRs) {
      setCrList([newCR]);
    } else {
      setCrList([...crList, newCR]);
    }
    setCrId("");
    setCrMobile("");
    setShowCrAddCard(false);
    alert("CR added successfully!");
  };

  const handleRemoveCR = (id) => {
    Alert.alert("Confirm Delete", "Are you sure to remove this CR?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setCrList(crList.filter((c) => c.id !== id)),
      },
    ]);
  };

  const filteredStudents = studentList.filter(
    (s) =>
      (studentFilters.branch === "All" || s.branch === studentFilters.branch) &&
      (studentFilters.year === "All" || s.year === studentFilters.year)
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Student & CR Management</Text>

      {/* --- Top Tab Switch --- */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "students" && styles.activeTab]}
          onPress={() => setActiveTab("students")}
        >
          <MaterialIcons
            name="school"
            size={20}
            color={activeTab === "students" ? "#fff" : "#8B0000"}
          />
          <Text style={[styles.tabText, activeTab === "students" && { color: "#fff" }]}>
            Students
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "crs" && styles.activeTab]}
          onPress={() => setActiveTab("crs")}
        >
          <MaterialIcons
            name="people"
            size={20}
            color={activeTab === "crs" ? "#fff" : "#8B0000"}
          />
          <Text style={[styles.tabText, activeTab === "crs" && { color: "#fff" }]}>CRs</Text>
        </TouchableOpacity>
      </View>

      {/* --- Students Panel --- */}
      {activeTab === "students" && (
        <View>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setShowStudentCard(true)}
          >
            <MaterialIcons name="upload-file" size={22} color="#fff" />
            <Text style={styles.primaryButtonText}>Upload Student List</Text>
          </TouchableOpacity>

          {/* Floating Student Card */}
          <Modal transparent visible={showStudentCard} animationType="fade">
            <View style={styles.modalBackground}>
              <View style={styles.floatingCard}>
                <Text style={styles.cardTitle}>Upload Students</Text>
                <Text style={styles.label}>Branch</Text>
                <Picker
                  selectedValue={studentBranch}
                  style={styles.picker}
                  onValueChange={setStudentBranch}
                >
                  {branches.map((b) => (
                    <Picker.Item label={b} value={b} key={b} />
                  ))}
                </Picker>
                <Text style={styles.label}>Year</Text>
                <Picker
                  selectedValue={studentYear}
                  style={styles.picker}
                  onValueChange={setStudentYear}
                >
                  {years.map((y) => (
                    <Picker.Item label={y} value={y} key={y} />
                  ))}
                </Picker>
                <TouchableOpacity style={styles.uploadBox}>
                  <MaterialIcons name="file-upload" size={28} color="#8B0000" />
                  <Text style={styles.uploadText}>Upload Excel File</Text>
                </TouchableOpacity>
                <View style={styles.toggleRow}>
                  <Text style={styles.label}>Replace Existing Data</Text>
                  <Switch
                    value={replaceStudents}
                    onValueChange={setReplaceStudents}
                    trackColor={{ false: "#ccc", true: "#8B0000" }}
                    thumbColor={replaceStudents ? "#fff" : "#8B0000"}
                  />
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={handleAddStudents}>
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowStudentCard(false)}
                >
                  <MaterialIcons name="close" size={22} color="#8B0000" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Students Filter */}
          <View style={styles.searchCard}>
            <Text style={styles.cardTitle}>Filter Students</Text>
            <View style={styles.searchRow}>
              <View style={styles.searchFilter}>
                <Text style={styles.label}>Branch</Text>
                <Picker
                  selectedValue={studentFilters.branch}
                  style={styles.smallPicker}
                  onValueChange={(v) => setStudentFilters({ ...studentFilters, branch: v })}
                >
                  {["All", ...branches].map((b) => (
                    <Picker.Item label={b} value={b} key={b} />
                  ))}
                </Picker>
              </View>
              <View style={styles.searchFilter}>
                <Text style={styles.label}>Year</Text>
                <Picker
                  selectedValue={studentFilters.year}
                  style={styles.smallPicker}
                  onValueChange={(v) => setStudentFilters({ ...studentFilters, year: v })}
                >
                  {["All", ...years].map((y) => (
                    <Picker.Item label={y} value={y} key={y} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          {/* Students List */}
          <Text style={styles.sectionTitle}>Students List</Text>
          {filteredStudents.length === 0 ? (
            <Text style={styles.noData}>No student records found.</Text>
          ) : (
            filteredStudents.map((s, i) => (
              <View
                key={i}
                style={[styles.studentCard, { backgroundColor: i % 2 === 0 ? "#fff" : "#f9f9f9" }]}
              >
                <Text style={styles.studentName}>{s.name}</Text>
                <Text style={styles.studentDetails}>
                  {s.branch} | {s.year}
                </Text>
              </View>
            ))
          )}
        </View>
      )}

      {/* --- CR Panel --- */}
      {activeTab === "crs" && (
        <View>
          <View style={{ flexDirection: "row", gap: 15, marginBottom: 10 }}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                setShowCrUploadCard(true);
                setShowCrAddCard(false);
              }}
            >
              <MaterialIcons name="file-upload" size={22} color="#fff" />
              <Text style={styles.primaryButtonText}>Upload Excel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                setShowCrAddCard(true);
                setShowCrUploadCard(false);
              }}
            >
              <MaterialIcons name="person-add" size={22} color="#fff" />
              <Text style={styles.primaryButtonText}>Add CR Manually</Text>
            </TouchableOpacity>
          </View>

          {/* Upload CR Card */}
          <Modal transparent visible={showCrUploadCard} animationType="fade">
            <View style={styles.modalBackground}>
              <View style={styles.floatingCard}>
                <Text style={styles.cardTitle}>Upload CRs</Text>
                <Text style={styles.label}>Branch</Text>
                <Picker
                  selectedValue={crBranch}
                  style={styles.picker}
                  onValueChange={setCrBranch}
                >
                  {branches.map((b) => (
                    <Picker.Item label={b} value={b} key={b} />
                  ))}
                </Picker>
                <Text style={styles.label}>Year</Text>
                <Picker
                  selectedValue={crYear}
                  style={styles.picker}
                  onValueChange={setCrYear}
                >
                  {years.map((y) => (
                    <Picker.Item label={y} value={y} key={y} />
                  ))}
                </Picker>
                <TouchableOpacity style={styles.uploadBox}>
                  <MaterialIcons name="file-upload" size={28} color="#8B0000" />
                  <Text style={styles.uploadText}>Upload Excel File</Text>
                </TouchableOpacity>
                <View style={styles.toggleRow}>
                  <Text style={styles.label}>Replace Existing Data</Text>
                  <Switch
                    value={replaceCRs}
                    onValueChange={setReplaceCRs}
                    trackColor={{ false: "#ccc", true: "#8B0000" }}
                    thumbColor={replaceCRs ? "#fff" : "#8B0000"}
                  />
                </View>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => {
                    if (replaceCRs) setCrList([{ id: "ExcelCR1", branch: crBranch, year: crYear }]);
                    else
                      setCrList([
                        ...crList,
                        { id: "ExcelCR1", branch: crBranch, year: crYear },
                      ]);
                    setShowCrUploadCard(false);
                  }}
                >
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowCrUploadCard(false)}
                >
                  <MaterialIcons name="close" size={22} color="#8B0000" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Add CR Manually Card */}
          <Modal transparent visible={showCrAddCard} animationType="fade">
            <View style={styles.modalBackground}>
              <View style={styles.floatingCard}>
                <Text style={styles.cardTitle}>Add CR Manually</Text>
                
                <TextInput
                  placeholder="CR ID"
                  style={styles.input}
                  value={crId}
                  onChangeText={setCrId}
                />
                <TextInput
                  placeholder="Mobile Number"
                  style={styles.input}
                  value={crMobile}
                  onChangeText={setCrMobile}
                  keyboardType="phone-pad"
                />
               
                <TouchableOpacity style={styles.submitButton} onPress={handleAddCR}>
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowCrAddCard(false)}
                >
                  <MaterialIcons name="close" size={22} color="#8B0000" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* CR List */}
          <Text style={styles.sectionTitle}>CR List</Text>
          {crList.length === 0 ? (
            <Text style={styles.noData}>No CR records found.</Text>
          ) : (
            crList.map((c, i) => (
              <View
                key={i}
                style={[styles.studentCard, { backgroundColor: i % 2 === 0 ? "#fff" : "#f9f9f9" }]}
              >
                <Text style={styles.studentName}>
                  {c.name} ({c.id})
                </Text>
                <Text style={styles.studentDetails}>
                  {c.branch} | {c.year} | {c.mobile}
                </Text>
                <TouchableOpacity onPress={() => handleRemoveCR(c.id)}>
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
  smallPicker: { backgroundColor: "#f3f3f3", borderRadius: 8, marginBottom: 8, height: 40 },
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
  searchCard: { backgroundColor: "#fff", padding: 10, borderRadius: 12, marginBottom: 15 },
  searchRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  searchFilter: { flex: 1 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginVertical: 10 },
  noData: { textAlign: "center", color: "#777", marginVertical: 10 },
  studentCard: { padding: 12, borderRadius: 8, marginBottom: 8, elevation: 1 },
  studentName: { fontSize: 16, fontWeight: "600", color: "#111" },
  studentDetails: { color: "#555", fontSize: 13 },
  input: { backgroundColor: "#f3f3f3", padding: 10, borderRadius: 8, marginBottom: 8 },
});
