// pages/SubjectsSchedulePage.jsx
import React, { useState } from 'react';
import AdminPortal from '../components/AdminPortal';

const SchedulePage = () => {
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
  
  // --- State Management ---
  const [subjectsFile, setSubjectsFile] = useState(null);
  const [schedulesFile, setSchedulesFile] = useState(null);
  const [replaceSubjects, setReplaceSubjects] = useState(false);
  const [replaceSchedules, setReplaceSchedules] = useState(false);
  const [isUploadingSubjects, setIsUploadingSubjects] = useState(false);
  const [isUploadingSchedules, setIsUploadingSchedules] = useState(false);
  const [selectedScheduleYear, setSelectedScheduleYear] = useState('E1');
  const [selectedScheduleBranch, setSelectedScheduleBranch] = useState('CSE');

  // --- Constants ---
  const yearOptions = ['E1', 'E2', 'E3', 'E4'];
  const branchOptions = ['CSE', 'ECE', 'EEE', 'CIVIL', 'ME', 'MME', 'CHEM'];
  const API_BASE_URL = 'https://ams-server-4eol.onrender.com';

  // --- Handlers ---
  const handleSelectFile = (fileType, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is Excel
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel.sheet.macroEnabled.12'
    ];
    
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid Excel file (.xls, .xlsx)');
      return;
    }

    if (fileType === 'subjects') {
      setSubjectsFile(file);
    } else {
      setSchedulesFile(file);
    }
  };

  const handleUpload = async (fileType) => {
    const file = fileType === 'subjects' ? subjectsFile : schedulesFile;
    const replace = fileType === 'subjects' ? replaceSubjects : replaceSchedules;
    const setLoading = fileType === 'subjects' ? setIsUploadingSubjects : setIsUploadingSchedules;
    const endpoint = fileType === 'subjects' ? '/subjects/upload' : '/defacultschedules/upload';
    const fileTypeName = fileType === 'subjects' ? 'Subjects' : 'Schedules';

    if (!file) {
      alert(`Please select a ${fileTypeName} file first.`);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('replace', String(replace));

      // Add year and department if uploading schedules
      if (fileType === 'schedules') {
        formData.append('year', selectedScheduleYear);
        formData.append('department', selectedScheduleBranch);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      const responseJson = await response.json();
      if (!response.ok) {
        throw new Error(responseJson.message || `Failed to upload ${fileTypeName}.`);
      }

      alert(responseJson.message);

      // Clear file input
      if (fileType === 'subjects') {
        setSubjectsFile(null);
        document.getElementById('subjects-file').value = '';
      } else {
        setSchedulesFile(null);
        document.getElementById('schedules-file').value = '';
      }
    } catch (error) {
      alert(`${fileTypeName} Upload Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearFile = (fileType) => {
    if (fileType === 'subjects') {
      setSubjectsFile(null);
      document.getElementById('subjects-file').value = '';
    } else {
      setSchedulesFile(null);
      document.getElementById('schedules-file').value = '';
    }
  };

  // Updated Styles with StudentPage-like Toggles
  const styles = {
    // Main container
    scheduleManagement: {
      minHeight: '100vh',
      background: '#f8f9fa',
      padding: '20px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    
    // Header section
    scheduleHeader: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    scheduleTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px',
    },
    scheduleSubtitle: {
      fontSize: '16px',
      color: '#666',
      margin: '0',
      lineHeight: '1.5',
    },
    
    // Grid layout
    scheduleContent: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '20px',
      maxWidth: '900px',
      margin: '0 auto',
    },
    
    // Cards - Matching StudentPage style
    uploadCard: {
      background: '#fff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e0e0e0',
    },
    
    // Card header - Matching StudentPage
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
    },
    cardIcon: {
      fontSize: '24px',
      marginRight: '12px',
      color: '#600202',
    },
    cardTitle: {
      fontSize: '22px',
      fontWeight: '600',
      color: '#333',
    },
    cardDescription: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '25px',
      lineHeight: '1.5',
    },
    
    // File input section - Matching StudentPage
    fileInputSection: {
      marginBottom: '20px',
    },
    fileInputLabel: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#e9ecef',
      padding: '15px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      border: '2px dashed #600202',
      marginBottom: '15px',
      '&:hover': {
        background: '#dee2e6',
      }
    },
    fileInputIcon: {
      fontSize: '18px',
      marginRight: '10px',
      color: '#600202',
    },
    fileInputText: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#600202',
    },
    fileInput: {
      display: 'none',
    },
    
    // File info
    fileInfo: {
      marginTop: '10px',
      fontStyle: 'italic',
      color: '#555',
      textAlign: 'center',
      padding: '10px',
      background: '#f8f9fa',
      borderRadius: '6px',
      border: '1px solid #e9ecef',
    },
    
    // Picker section - Matching StudentPage
    pickerSection: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
      marginBottom: '20px',
    },
    pickerGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    pickerLabel: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#333',
      marginBottom: '8px',
    },
    pickerSelect: {
      width: '100%',
      padding: '12px 15px',
      border: 'none',
      background: '#f8f9fa',
      fontSize: '16px',
      color: '#333',
      outline: 'none',
      cursor: 'pointer',
      borderRadius: '8px',
      border: '1px solid #dee2e6',
      '&:focus': {
        background: '#fff',
      }
    },
    
    // TOGGLE SECTION - Matching StudentPage exactly
    toggleSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '25px',
      padding: '20px 0',
      borderTop: '1px solid #eee',
      borderBottom: '1px solid #eee',
    },
    toggleLabel: {
      fontSize: '16px',
      color: '#333',
      fontWeight: '500',
      flex: '1',
      marginRight: '15px',
    },
    
    // Custom Switch Styles - Exactly like StudentPage
    switch: {
      position: 'relative',
      display: 'inline-block',
      width: '60px',
      height: '34px',
    },
    switchInput: {
      opacity: '0',
      width: '0',
      height: '0',
    },
    slider: {
      position: 'absolute',
      cursor: 'pointer',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#ccc',
      transition: '.4s',
      borderRadius: '34px',
    },
    sliderBefore: {
      position: 'absolute',
      height: '26px',
      width: '26px',
      left: '4px',
      bottom: '4px',
      backgroundColor: 'white',
      transition: '.4s',
      borderRadius: '50%',
    },
    sliderActive: {
      backgroundColor: '#b33939',
    },
    sliderBeforeActive: {
      transform: 'translateX(26px)',
    },
    
    // Upload button - Matching StudentPage
    uploadBtn: {
      width: '100%',
      background: '#600202',
      color: '#fff',
      padding: '18px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      marginTop: '25px',
      '&:hover:not(:disabled)': {
        background: '#4a0101',
      }
    },
    uploadBtnDisabled: {
      background: '#aaa',
      cursor: 'not-allowed',
    },
    
    // Loading indicator - Matching StudentPage
    loadingIndicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid transparent',
      borderTop: '2px solid #fff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  };

  const scheduleContent = (
    <div style={styles.scheduleManagement}>
      <div style={styles.scheduleHeader}>
        <h1 style={styles.scheduleTitle}>Schedule Management</h1>
        <p style={styles.scheduleSubtitle}>
          Manage subjects and class schedules for different branches with easy file uploads
        </p>
      </div>

      <div style={styles.scheduleContent}>
        {/* Subjects Upload Card */}
        <div style={styles.uploadCard}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>📚</span>
            <div style={styles.cardTitle}>Manage Subjects</div>
          </div>
          
          <p style={styles.cardDescription}>
            Upload an Excel file to add new subjects. Use the toggle to replace all existing subjects with the new list.
          </p>

          <div style={styles.fileInputSection}>
            <label 
              htmlFor="subjects-file" 
              style={styles.fileInputLabel}
            >
              <span style={styles.fileInputIcon}>📎</span>
              <span style={styles.fileInputText}>
                {subjectsFile ? 'Change Subjects File' : 'Select Subjects File'}
              </span>
              <input
                id="subjects-file"
                type="file"
                accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(e) => handleSelectFile('subjects', e)}
                style={styles.fileInput}
              />
            </label>
            
            {subjectsFile && (
              <div style={styles.fileInfo}>{subjectsFile.name}</div>
            )}
          </div>

          {/* Toggle Section - Same as StudentPage */}
          <div style={styles.toggleSection}>
            <div style={styles.toggleLabel}>Replace All Existing Subjects</div>
            <label style={styles.switch}>
              <input
                type="checkbox"
                checked={replaceSubjects}
                onChange={(e) => setReplaceSubjects(e.target.checked)}
                style={styles.switchInput}
              />
              <span 
                style={{
                  ...styles.slider,
                  ...(replaceSubjects ? styles.sliderActive : {})
                }}
              >
                <span 
                  style={{
                    ...styles.sliderBefore,
                    ...(replaceSubjects ? styles.sliderBeforeActive : {})
                  }}
                ></span>
              </span>
            </label>
          </div>

          <button
            style={{
              ...styles.uploadBtn,
              ...(!subjectsFile || isUploadingSubjects ? styles.uploadBtnDisabled : {})
            }}
            onClick={() => handleUpload('subjects')}
            disabled={!subjectsFile || isUploadingSubjects}
          >
            {isUploadingSubjects ? (
              <div style={styles.loadingIndicator}>
                <div style={styles.spinner}></div>
                Uploading...
              </div>
            ) : (
              'Upload Subjects'
            )}
          </button>
        </div>

        {/* Schedules Upload Card */}
        <div style={styles.uploadCard}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>📅</span>
            <div style={styles.cardTitle}>Manage Default Schedules</div>
          </div>
          
          <p style={styles.cardDescription}>
            Select a class, then upload its default weekly timetable. Use the toggle to replace only the schedule for that specific class.
          </p>

          <div style={styles.pickerSection}>
            <div style={styles.pickerGroup}>
              <div style={styles.pickerLabel}>Select Year:</div>
              <select
                value={selectedScheduleYear}
                onChange={(e) => setSelectedScheduleYear(e.target.value)}
                style={styles.pickerSelect}
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div style={styles.pickerGroup}>
              <div style={styles.pickerLabel}>Select Branch:</div>
              <select
                value={selectedScheduleBranch}
                onChange={(e) => setSelectedScheduleBranch(e.target.value)}
                style={styles.pickerSelect}
              >
                {branchOptions.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.fileInputSection}>
            <label 
              htmlFor="schedules-file" 
              style={styles.fileInputLabel}
            >
              <span style={styles.fileInputIcon}>📎</span>
              <span style={styles.fileInputText}>
                {schedulesFile ? 'Change Schedules File' : 'Select Schedules File'}
              </span>
              <input
                id="schedules-file"
                type="file"
                accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(e) => handleSelectFile('schedules', e)}
                style={styles.fileInput}
              />
            </label>
            
            {schedulesFile && (
              <div style={styles.fileInfo}>{schedulesFile.name}</div>
            )}
          </div>

          {/* Toggle Section - Same as StudentPage */}
          <div style={styles.toggleSection}>
            <div style={styles.toggleLabel}>Replace This Class's Schedule</div>
            <label style={styles.switch}>
              <input
                type="checkbox"
                checked={replaceSchedules}
                onChange={(e) => setReplaceSchedules(e.target.checked)}
                style={styles.switchInput}
              />
              <span 
                style={{
                  ...styles.slider,
                  ...(replaceSchedules ? styles.sliderActive : {})
                }}
              >
                <span 
                  style={{
                    ...styles.sliderBefore,
                    ...(replaceSchedules ? styles.sliderBeforeActive : {})
                  }}
                ></span>
              </span>
            </label>
          </div>

          <button
            style={{
              ...styles.uploadBtn,
              ...(!schedulesFile || isUploadingSchedules ? styles.uploadBtnDisabled : {})
            }}
            onClick={() => handleUpload('schedules')}
            disabled={!schedulesFile || isUploadingSchedules}
          >
            {isUploadingSchedules ? (
              <div style={styles.loadingIndicator}>
                <div style={styles.spinner}></div>
                Uploading...
              </div>
            ) : (
              'Upload Schedules'
            )}
          </button>
        </div>
      </div>

      {/* Global Styles */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          
          /* Responsive Design */
          @media (max-width: 768px) {
            .schedule-content {
              grid-template-columns: 1fr;
            }
            
            .picker-section {
              grid-template-columns: 1fr;
            }
            
            .toggle-section {
              flex-direction: column;
              gap: 15px;
              align-items: flex-start;
            }
            
            .toggle-label {
              margin-right: 0;
            }
          }
        `}
      </style>
    </div>
  );

  return (
    <AdminPortal user={user}>
      {scheduleContent}
    </AdminPortal>
  );
};

export default SchedulePage;