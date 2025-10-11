import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Picker,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState([]);
  const [showUploadCard, setShowUploadCard] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ department: "All", year: "All", search: "" });
  const [newFaculty, setNewFaculty] = useState({
    id: "",
    name: "",
    subject: "",
    department: "CSE",
    year: "E1",
    section: "A",
  });

  const handleAddFaculty = () => {
    if (!newFaculty.id || !newFaculty.name || !newFaculty.subject) {
      alert("Please fill all fields!");
      return;
    }
    setFacultyList([...facultyList, { ...newFaculty }]);
    setNewFaculty({
      id: "",
      name: "",
      subject: "",
      department: "CSE",
      year: "E1",
      section: "A",
    });
    setShowAddCard(false);
  };

  const handleRemoveFaculty = (id) => {
    setFacultyList(facultyList.filter((f) => f.id !== id));
  };

  const handleEditFaculty = (id) => {
    const faculty = facultyList.find((f) => f.id === id);
    if (faculty) {
      setNewFaculty(faculty);
      setFacultyList(facultyList.filter((f) => f.id !== id));
      setShowAddCard(true);
    }
  };

  const filteredList = facultyList.filter((f) => {
    return (
      (filters.department === "All" || f.department === filters.department) &&
      (filters.year === "All" || f.year === filters.year) &&
      f.name.toLowerCase().includes(filters.search.toLowerCase())
    );
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Faculty Management</Text>

      {/* Search Bar with Filter Icon */}
      <View style={styles.searchBarRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search..."
          value={filters.search}
          onChangeText={(text) => setFilters({ ...filters, search: text })}
        />
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.filterIcon}>
          <MaterialIcons name="filter-list" size={28} color="#8B0000" />
        </TouchableOpacity>
      </View>

      {/* Filter Options (Shown when icon clicked) */}
      {showFilters && (
        <View style={styles.filterCard}>
          <View style={styles.filterBox}>
            <Text style={styles.filterLabel}>Department</Text>
            <Picker
              selectedValue={filters.department}
              onValueChange={(v) => setFilters({ ...filters, department: v })}
            >
              {["All", "CSE", "ECE", "EEE", "CIVIL", "MECH", "MME", "CHEM"].map((d) => (
                <Picker.Item label={d} value={d} key={d} />
              ))}
            </Picker>
          </View>
          <View style={styles.filterBox}>
            <Text style={styles.filterLabel}>Academic Year</Text>
            <Picker
              selectedValue={filters.year}
              onValueChange={(v) => setFilters({ ...filters, year: v })}
            >
              {["All", "E1", "E2", "E3", "E4"].map((y) => (
                <Picker.Item label={y} value={y} key={y} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {/* Floating Action Buttons */}
      <View style={styles.floatingButtons}>
        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: "#8B0000" }]}
          onPress={() => {
            setShowUploadCard(true);
            setShowAddCard(false);
          }}
        >
          <MaterialIcons name="upload-file" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: "#B22222" }]}
          onPress={() => {
            setShowAddCard(true);
            setShowUploadCard(false);
          }}
        >
          <MaterialIcons name="person-add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Upload Excel Modal */}
      <Modal visible={showUploadCard} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Upload Faculty Excel File</Text>
            <TouchableOpacity style={styles.uploadBox}>
              <MaterialIcons name="file-upload" size={30} color="#8B0000" />
              <Text style={styles.uploadText}>Choose File</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowUploadCard(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Faculty Modal */}
      <Modal visible={showAddCard} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Add Faculty Details</Text>
            <TextInput
              placeholder="Faculty ID"
              style={styles.input}
              value={newFaculty.id}
              onChangeText={(t) => setNewFaculty({ ...newFaculty, id: t })}
            />
            <TextInput
              placeholder="Full Name"
              style={styles.input}
              value={newFaculty.name}
              onChangeText={(t) => setNewFaculty({ ...newFaculty, name: t })}
            />
            <TextInput
              placeholder="Subject Code"
              style={styles.input}
              value={newFaculty.subject}
              onChangeText={(t) => setNewFaculty({ ...newFaculty, subject: t })}
            />
            <View style={styles.pickerRow}>
              <Picker
                style={styles.picker}
                selectedValue={newFaculty.department}
                onValueChange={(v) => setNewFaculty({ ...newFaculty, department: v })}
              >
                {["CSE", "ECE", "EEE", "CIVIL", "MECH", "MME", "CHEM"].map((d) => (
                  <Picker.Item label={d} value={d} key={d} />
                ))}
              </Picker>
              <Picker
                style={styles.picker}
                selectedValue={newFaculty.year}
                onValueChange={(v) => setNewFaculty({ ...newFaculty, year: v })}
              >
                {["E1", "E2", "E3", "E4"].map((y) => (
                  <Picker.Item label={y} value={y} key={y} />
                ))}
              </Picker>
              <Picker
                style={styles.picker}
                selectedValue={newFaculty.section}
                onValueChange={(v) => setNewFaculty({ ...newFaculty, section: v })}
              >
                {["A", "B", "C", "D", "E"].map((s) => (
                  <Picker.Item label={s} value={s} key={s} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddFaculty}>
              <Text style={styles.saveButtonText}>Add Faculty</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowAddCard(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Faculty List */}
      <Text style={styles.sectionTitle}>Faculty List</Text>
      {filteredList.length === 0 ? (
        <Text style={styles.noData}>No faculty records available.</Text>
      ) : (
        filteredList.map((f, index) => (
          <View
            key={index}
            style={[
              styles.facultyCard,
              { backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" },
            ]}
          >
            <View>
              <Text style={styles.facultyName}>{f.name}</Text>
              <Text style={styles.facultyDetails}>
                ID: {f.id} | {f.department} | {f.year}-{f.section} | {f.subject}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleEditFaculty(f.id)}>
                <MaterialIcons name="edit" size={22} color="#B22222" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRemoveFaculty(f.id)}>
                <MaterialIcons name="delete" size={22} color="#555" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fafafa" },
  title: { fontSize: 26, fontWeight: "bold", color: "#8B0000", marginBottom: 20 },

  searchBarRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  searchInput: {
    width: "75%",
    backgroundColor: "#f3f3f3",
    padding: 8,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 14,
  },
  filterIcon: { marginLeft: 10, padding: 5 },

  filterCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  filterBox: { marginBottom: 8 },
  filterLabel: { fontSize: 12, fontWeight: "600", color: "#444", marginBottom: 3 },

  floatingButtons: {
    position: "absolute",
    bottom: 25,
    right: 20,
    flexDirection: "column",
    gap: 15,
  },
  floatingButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "85%",
    elevation: 5,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#8B0000", marginBottom: 10 },
  input: {
    backgroundColor: "#f3f3f3",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  pickerRow: { flexDirection: "row", justifyContent: "space-between" },
  picker: { flex: 1, marginHorizontal: 3 },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 18,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  uploadText: { marginTop: 6, color: "#8B0000", fontWeight: "500" },
  saveButton: {
    backgroundColor: "#8B0000",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 5,
  },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
  closeButton: { marginTop: 10, alignItems: "center" },
  closeText: { color: "#8B0000", fontWeight: "600" },

  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 15, color: "#333" },
  noData: { textAlign: "center", color: "#777", marginVertical: 10 },
  facultyCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  facultyName: { fontSize: 16, fontWeight: "600", color: "#111" },
  facultyDetails: { color: "#555", fontSize: 13 },
  iconContainer: { flexDirection: "row", gap: 18 },
});
