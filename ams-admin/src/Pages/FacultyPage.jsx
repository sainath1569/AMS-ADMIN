// pages/FacultyPage.jsx
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import AdminPortal from '../components/AdminPortal';
import '../styles/FacultyPage.css';

// Filter options
const departmentOptions = ['All', 'CSE', 'ECE', 'EEE', 'CIVIL', 'ME', 'MME', 'CHEM'];
const yearOptions = ['All', 'E1', 'E2', 'E3', 'E4'];
const sectionOptions = ['All', 'A', 'B', 'C', 'D', 'E'];
const batch = {'1': 'E1', '2': 'E2', '3': 'E3', '4': 'E4'};
const API_BASE_URL = 'https://ams-server-4eol.onrender.com';

const FacultyPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyList, setFacultyList] = useState([]);
  const [filteredFacultyList, setFilteredFacultyList] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState(null);
  
  const [newFaculty, setNewFaculty] = useState({
    id: "",
    name: "",
    department: "",
    subject_code: "",
    year: "",
    section: "",
    assignment_id: 0,
  });

  const [editingFaculty, setEditingFaculty] = useState({
    id: "",
    name: "",
    department: "",
    subject_code: "",
    year: "",
    section: "",
    assignment_id: 0,
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch faculty list from backend
  const fetchFacultyListFromBackend = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/faculties`);
      const data = await response.json();
      const facultyData = data.faculties || [];

      // Convert year to display format
      const formattedData = facultyData.map(faculty => ({
        ...faculty,
        year: batch[faculty.year] || faculty.year
      }));

      setFacultyList(formattedData);
      
    } catch (error) {
      Swal.fire("Error", "Failed to fetch faculty list", "error");
      console.error("Error fetching faculty list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter faculty based on selected filters and search query
  const filterFaculty = () => {
    let filtered = facultyList;
    
    // Apply department filter
    if (selectedDepartment !== 'All') {
      filtered = filtered.filter(faculty => faculty.department === selectedDepartment);
    }
    
    // Apply year filter
    if (selectedYear !== 'All') {
      filtered = filtered.filter(faculty => faculty.year === selectedYear);
    }
    
    // Apply section filter
    if (selectedSection !== 'All') {
      filtered = filtered.filter(faculty => faculty.section === selectedSection);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faculty => 
        faculty.name.toLowerCase().includes(query) ||
        faculty.id.toLowerCase().includes(query) ||
        faculty.subject_code.toLowerCase().includes(query)
      );
    }
    
    setFilteredFacultyList(filtered);
  };

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (selectedDepartment !== 'All') count++;
    if (selectedYear !== 'All') count++;
    if (selectedSection !== 'All') count++;
    return count;
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedDepartment('All');
    setSelectedYear('All');
    setSelectedSection('All');
    setSearchQuery('');
  };

  // Apply filters and close modal
  const applyFilters = () => {
    setIsFilterModalVisible(false);
    filterFaculty();
  };

  // Remove faculty
  const removeFaculty = async (assignmentId) => {
    Swal.fire({
      title: "Remove Faculty",
      text: "Are you sure you want to remove this faculty member?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_BASE_URL}/faculties/remove/${assignmentId}`, {
            method: 'DELETE',
          });
          
          if (response.ok) {
            const updatedList = facultyList.filter(faculty => faculty.assignment_id !== assignmentId);
            setFacultyList(updatedList);
            Swal.fire("Success", "Faculty removed successfully!", "success");
          } else {
            throw new Error("Failed to remove faculty");
          }
        } catch (error) {
          Swal.fire("Error", "Failed to remove faculty", "error");
        }
      }
    });
  };

  // Edit faculty
  const editFaculty = (faculty) => {
    setEditingFaculty({...faculty});
    setIsEditModalVisible(true);
  };

  // Handle adding new faculty
  const handleAddFaculty = async () => {
    // Validation
    if (!newFaculty.id || !newFaculty.name || !newFaculty.subject_code || !newFaculty.department || !newFaculty.year || !newFaculty.section) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/faculties/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFaculty)
      });

      const responseData = await response.json();
      
      if (response.ok && responseData.success) {
        const addedFaculty = responseData.faculty;
        // Convert year back to display format
        addedFaculty.year = batch[addedFaculty.year] || addedFaculty.year;
        
        const updatedList = [...facultyList, addedFaculty];
        setFacultyList(updatedList);
        resetAddForm();
        Swal.fire("Success", "Faculty added successfully!", "success");
      } else {
        Swal.fire("Error", responseData.message || "Failed to add faculty", "error");
      }
    } catch (error) {
      console.error("Add faculty error:", error);
      Swal.fire("Error", "Failed to add faculty. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle updating faculty
  const handleUpdateFaculty = async () => {
    if (!editingFaculty) return;

    // Validation
    if (!editingFaculty.assignment_id || !editingFaculty.id || !editingFaculty.name || !editingFaculty.subject_code || !editingFaculty.department || !editingFaculty.year || !editingFaculty.section) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('faculty', JSON.stringify(editingFaculty));
      
      const response = await fetch(`${API_BASE_URL}/faculties/update/${editingFaculty.assignment_id}`, {
        method: 'PUT', 
        body: formData
      });
      
      const responseData = await response.json();
      
      if (responseData.success) {
        const editedFaculty = responseData.faculty;
        const updatedList = facultyList.map(faculty => 
          faculty.assignment_id === editingFaculty.assignment_id ? editedFaculty : faculty
        );
        setFacultyList(updatedList);
        resetEditForm();
        Swal.fire("Success", "Faculty updated successfully!", "success");
      } else {
        Swal.fire("Error", responseData.message || "Failed to update faculty", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update faculty. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Excel upload
  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is Excel
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      Swal.fire("Error", "Please select an Excel file (.xlsx or .xls)", "error");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/faculties/upload_faculty`, {
        method: 'POST',
        body: formData,
      });

      const responseJson = await response.json();

      if (response.ok) {
        Swal.fire('Success', responseJson.message, 'success');
        await fetchFacultyListFromBackend();
        setIsUploadModalVisible(false);
      } else {
        throw new Error(responseJson.message || 'Something went wrong');
      }

    } catch (error) {
      console.error('Upload error:', error);
      Swal.fire('Error', error.message || 'An unexpected error occurred during the upload.', 'error');
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Reset forms
  const resetAddForm = () => {
    setNewFaculty({
      id: "",
      name: "",
      department: "",
      subject_code: "",
      year: "",
      section: "",
      assignment_id: 0,
    });
    setIsAddModalVisible(false);
  };

  const resetEditForm = () => {
    setEditingFaculty({
      id: "",
      name: "",
      department: "",
      subject_code: "",
      year: "",
      section: "",
      assignment_id: 0,
    });
    setIsEditModalVisible(false);
  };

  // Load user from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('adminUser');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  // Fetch faculty list on component mount
  useEffect(() => {
    fetchFacultyListFromBackend();
  }, []);

  // Filter and search when criteria change
  useEffect(() => {
    filterFaculty();
  }, [selectedDepartment, selectedYear, selectedSection, searchQuery, facultyList]);

  // Show loading while user data is being fetched
  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Render filter buttons for modal
  const renderFilterButtons = (options, selected, setSelected, label) => (
    <div className="filter-section">
      <div className="filter-label">{label}:</div>
      <div className="filter-buttons-container">
        {options.map((option) => (
          <button
            key={option}
            className={`filter-button ${selected === option ? 'filter-button-selected' : ''}`}
            onClick={() => setSelected(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  // Render faculty item
  const renderFacultyItem = (item) => (
    <div key={item.assignment_id} className="faculty-card">
      <div className="faculty-info">
        <div className="faculty-header">
          <div className="faculty-name">{item.name}</div>
          <div className="faculty-badge">
            FACULTY
          </div>
        </div>
        <div className="faculty-details-container">
          <div className="detail-row">
            <span className="icon">👤</span>
            <div className="faculty-details">ID: {item.id}</div>
          </div>
          <div className="detail-row">
            <span className="icon">🏢</span>
            <div className="faculty-details">Dept: {item.department}</div>
          </div>
          <div className="detail-row">
            <span className="icon">📚</span>
            <div className="faculty-details">Subject Code: {item.subject_code}</div>
          </div>
          <div className="detail-row">
            <span className="icon">🎓</span>
            <div className="faculty-details">Year: {item.year} • Section: {item.section}</div>
          </div>
        </div>
      </div>
      <div className="action-buttons">
        <button 
          className="edit-button"
          onClick={() => editFaculty(item)}
        >
          ✏️
        </button>
        <button 
          className="remove-button"
          onClick={() => removeFaculty(item.assignment_id)}
        >
          🗑️
        </button>
      </div>
    </div>
  );

  // Render input field for forms
  const renderInputField = (label, value, onChange, placeholder, isEditable = true, type = 'text') => (
    <div className="input-group">
      <div className="label">{label} *</div>
      <input
        className={`text-input ${!isEditable ? 'text-input-disabled' : ''}`}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={!isEditable || isSubmitting}
      />
    </div>
  );

  // Render option buttons for forms
  const renderOptionButtons = (label, options, selected, onSelect) => (
    <div className="input-group">
      <div className="label">{label}</div>
      <div className="option-buttons">
        {options.filter(opt => opt !== 'All').map((option) => (
          <button
            key={option}
            className={`option-button ${selected === option ? 'option-button-selected' : ''}`}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <AdminPortal user={user}>
      <div className="faculty-management-container">
        {/* Search and Filter Row */}
<div className="search-filter-row">
  {/* Search Bar - Takes about 50% width */}
  <div className="search-input-container">
    <span className="search-icon">🔍</span>
    <input
      className="search-input"
      placeholder="Search by name, ID, or subject code..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    {searchQuery !== '' && (
      <button className="clear-search" onClick={() => setSearchQuery('')}>
        ✕
      </button>
    )}
  </div>
  
  {/* Filter Button */}
  <button 
    className={`filter-button-main ${countActiveFilters() > 0 ? 'filter-button-active' : ''}`} 
    onClick={() => setIsFilterModalVisible(true)}
  >
    <span className="filter-icon">⚙️</span>
    {countActiveFilters() > 0 && (
      <div className="filter-badge">
        {countActiveFilters()}
      </div>
    )}
  </button>

  {/* Action Buttons */}
  <div className="action-buttons-container">
    <button className="upload-button1" onClick={() => setIsUploadModalVisible(true)}>
      <span className="button-icon">📤</span>
      Upload Excel
    </button>
    
    <button className="add-button" onClick={() => setIsAddModalVisible(true)}>
      <span className="button-icon">👨‍🏫</span>
      Add Faculty
    </button>
  </div>
</div>

        {/* Stats Bar */}
        <div className="stats-container">
          <div className="stats-text">
            Showing {filteredFacultyList.length} faculty assignment{filteredFacultyList.length !== 1 ? 's' : ''}
            {(selectedDepartment !== 'All' || selectedYear !== 'All' || selectedSection !== 'All' || searchQuery !== '') && 
              ` • ${countActiveFilters()} filter${countActiveFilters() !== 1 ? 's' : ''} applied${searchQuery !== '' ? ' + search' : ''}`
            }
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading Faculty...</div>
          </div>
        )}

        {/* Faculty List */}
        {!isLoading && (
          <div className="faculty-list-container">
            {filteredFacultyList.length > 0 ? (
              filteredFacultyList.map(renderFacultyItem)
            ) : (
              <div className="empty-container">
                <div className="empty-icon">👨‍🏫</div>
                <div className="empty-text">No Faculty Members Found</div>
                <div className="empty-subtext">
                  {selectedDepartment !== 'All' || selectedYear !== 'All' || selectedSection !== 'All' || searchQuery !== '' 
                    ? 'Try changing your filters or add a new faculty member' 
                    : 'No faculty members available. Add a new faculty member to get started'
                  }
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filter Modal */}
        {isFilterModalVisible && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title">Filters</div>
                <button className="modal-close" onClick={() => setIsFilterModalVisible(false)}>
                  ✕
                </button>
              </div>

              <div className="filters-modal-container">
                {renderFilterButtons(departmentOptions, selectedDepartment, setSelectedDepartment, 'Department')}
                {renderFilterButtons(yearOptions, selectedYear, setSelectedYear, 'Academic Year')}
                {renderFilterButtons(sectionOptions, selectedSection, setSelectedSection, 'Section')}
                
                <div className="filter-actions">
                  <button className="clear-all-button" onClick={clearFilters}>
                    Clear All
                  </button>
                  <button className="apply-button" onClick={applyFilters}>
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Faculty Modal */}
        {isAddModalVisible && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title">Add New Faculty</div>
                {!isSubmitting && (
                  <button className="modal-close" onClick={resetAddForm}>
                    ✕
                  </button>
                )}
              </div>

              <div className="form-container">
                {renderInputField("Faculty ID", newFaculty.id, (text) => setNewFaculty({...newFaculty, id: text}), "Enter faculty ID")}
                {renderInputField("Full Name", newFaculty.name, (text) => setNewFaculty({...newFaculty, name: text}), "Enter full name")}
                {renderInputField("Subject Code", newFaculty.subject_code, (text) => setNewFaculty({...newFaculty, subject_code: text}), "Enter subject code")}
                {renderOptionButtons("Department", departmentOptions, newFaculty.department, (dept) => setNewFaculty({...newFaculty, department: dept}))}
                {renderOptionButtons("Academic Year", yearOptions, newFaculty.year, (year) => setNewFaculty({...newFaculty, year: year}))}
                {renderOptionButtons("Section", sectionOptions, newFaculty.section, (section) => setNewFaculty({...newFaculty, section: section}))}
              </div>

              <div className="modal-footer">
                <button className="cancel-button" onClick={resetAddForm} disabled={isSubmitting}>
                  Cancel
                </button>
                <button 
                  className={`submit-button ${(!newFaculty.id || !newFaculty.name || !newFaculty.subject_code || isSubmitting) ? 'submit-button-disabled' : ''}`}
                  onClick={handleAddFaculty}
                  disabled={!newFaculty.id || !newFaculty.name || !newFaculty.subject_code || isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Faculty'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Faculty Modal */}
        {isEditModalVisible && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title">Edit Faculty</div>
                {!isSubmitting && (
                  <button className="modal-close" onClick={resetEditForm}>
                    ✕
                  </button>
                )}
              </div>

              <div className="form-container">
                {editingFaculty && (
                  <>
                    {renderInputField("Faculty ID", editingFaculty.id, (text) => setEditingFaculty({...editingFaculty, id: text}), "Enter faculty ID", false)}
                    {renderInputField("Full Name", editingFaculty.name, (text) => setEditingFaculty({...editingFaculty, name: text}), "Enter full name")}
                    {renderInputField("Subject Code", editingFaculty.subject_code, (text) => setEditingFaculty({...editingFaculty, subject_code: text}), "Enter subject code")}
                    {renderOptionButtons("Department", departmentOptions, editingFaculty.department, (dept) => setEditingFaculty({...editingFaculty, department: dept}))}
                    {renderOptionButtons("Academic Year", yearOptions, editingFaculty.year, (year) => setEditingFaculty({...editingFaculty, year: year}))}
                    {renderOptionButtons("Section", sectionOptions, editingFaculty.section, (section) => setEditingFaculty({...editingFaculty, section: section}))}
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button className="cancel-button" onClick={resetEditForm} disabled={isSubmitting}>
                  Cancel
                </button>
                <button 
                  className={`submit-button ${(!editingFaculty?.id || !editingFaculty?.name || !editingFaculty?.subject_code || isSubmitting) ? 'submit-button-disabled' : ''}`}
                  onClick={handleUpdateFaculty}
                  disabled={!editingFaculty?.id || !editingFaculty?.name || !editingFaculty?.subject_code || isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Faculty'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Excel Modal */}
        {isUploadModalVisible && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title">Upload Excel Sheet</div>
                {!isUploading && (
                  <button className="modal-close" onClick={() => setIsUploadModalVisible(false)}>
                    ✕
                  </button>
                )}
              </div>

              <div className="upload-container">
                <div className="upload-icon">📤</div>
                <div className="upload-title">Upload Faculty Excel Sheet</div>
                <div className="upload-description">
                  Upload an Excel file with columns: Faculty ID, Name, Department, Subject Code, Year, Section
                </div>
                
                {isUploading && (
                  <div className="progress-container">
                    <div className="progress-text">Uploading... {uploadProgress}%</div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                <label className={`upload-modal-button ${isUploading ? 'button-disabled' : ''}`}>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelUpload}
                    disabled={isUploading}
                    style={{ display: 'none' }}
                  />
                  <span className="button-icon">📤</span>
                  {isUploading ? 'Uploading...' : 'Choose Excel File'}
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPortal>
  );
};

export default FacultyPage;