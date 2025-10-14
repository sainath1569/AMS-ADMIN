// pages/StudentPage.jsx
import React, { useState, useEffect } from 'react'; // Add useEffect
import Swal from 'sweetalert2';
import AdminPortal from '../components/AdminPortal';
import '../styles/StudentPage.css';

// Constants
const yearOptions = ['E1', 'E2', 'E3', 'E4'];
const branchOptions = ['CSE', 'ECE', 'EEE', 'CIVIL', 'ME', 'MME', 'CHEM'];

const StudentPage = () => {
    // State Management
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [replaceStudents, setReplaceStudents] = useState(false);
    const [selectedYear, setSelectedYear] = useState('E3');
    const [selectedBranch, setSelectedBranch] = useState('CSE');
    const [user, setUser] = useState(null); // Add user state

    const API_BASE_URL = 'https://ams-server-4eol.onrender.com';

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

    // Handlers
    const handleSelectFile = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Check if file is Excel
        if (!file.name.match(/\.(xlsx|xls)$/)) {
            Swal.fire('Error', 'Please select an Excel file (.xlsx or .xls)', 'error');
            return;
        }

        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            Swal.fire('No File Selected', 'Please select a file before uploading.', 'error');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('year', selectedYear);
            formData.append('department', selectedBranch);
            formData.append('replace', String(replaceStudents));

            const response = await fetch(`${API_BASE_URL}/students/upload`, {
                method: 'POST',
                body: formData,
            });

            const responseJson = await response.json();
            if (!response.ok) {
                throw new Error(responseJson.message || 'Something went wrong on the server.');
            }

            Swal.fire('Success', responseJson.message, 'success');
            setSelectedFile(null);
            // Reset file input
            document.getElementById('file-input').value = '';

        } catch (error) {
            Swal.fire('Upload Failed', error.message, 'error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <AdminPortal user={user}>
            <div className="student-management-container">
                <div className="header-title">Student Management</div>
                
                <div className="card">
                    <div className="card-header">
                        <span className="card-icon">👨‍🎓</span>
                        <div className="card-title">Manage Students by Class</div>
                    </div>
                    <div className="card-description">
                        Select a class, then upload an Excel file of students. Use the toggle to replace all students for that specific class.
                    </div>

                    <div className="picker-label">Select Year:</div>
                    <div className="picker-container">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="picker"
                        >
                            {yearOptions.map(year => 
                                <option key={year} value={year}>{year}</option>
                            )}
                        </select>
                    </div>

                    <div className="picker-label">Select Branch:</div>
                    <div className="picker-container">
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="picker"
                        >
                            {branchOptions.map(branch => 
                                <option key={branch} value={branch}>{branch}</option>
                            )}
                        </select>
                    </div>

                    <label htmlFor="file-input" className="select-button">
                        <span className="button-icon">📎</span>
                        <span className="select-button-text">Select Students File</span>
                    </label>
                    <input
                        id="file-input"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleSelectFile}
                        style={{ display: 'none' }}
                    />
                    
                    {selectedFile && <div className="file-name">{selectedFile.name}</div>}
                    
                    <div className="toggle-container">
                        <div className="toggle-label">Replace Students for This Class</div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={replaceStudents}
                                onChange={(e) => setReplaceStudents(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                    
                    <button
                        className={`upload-button ${!selectedFile || isUploading ? 'button-disabled' : ''}`}
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                    >
                        {isUploading ? (
                            <div className="loading-indicator">
                                <div className="spinner"></div>
                                Uploading...
                            </div>
                        ) : (
                            'Upload Students'
                        )}
                    </button>
                </div>
            </div>
        </AdminPortal>
    );
};

export default StudentPage;