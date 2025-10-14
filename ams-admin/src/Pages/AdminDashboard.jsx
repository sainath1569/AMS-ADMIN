// Pages/AdminDashboard.jsx
import React, { useState } from 'react';
import AdminPortal from '../components/AdminPortal';
import FacultyDashboard from '../components/FacultyDashboard';
import StudentDashboard from '../components/StudentDashboard';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('student'); // 'student' or 'faculty'
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

  return (
    <AdminPortal user={user}>
      <div style={styles.container}>
        {/* Dashboard Header with Toggle */}
        <div style={styles.header}>
          <h1 style={styles.title}>Academic Analytics Dashboard</h1>
          <div style={styles.toggleContainer}>
            <button
              style={{
                ...styles.toggleBtn,
                ...(activeTab === 'student' ? styles.toggleBtnActive : {})
              }}
              onClick={() => setActiveTab('student')}
            >
              🎓 Student Performance
            </button>
            <button
              style={{
                ...styles.toggleBtn,
                ...(activeTab === 'faculty' ? styles.toggleBtnActive : {})
              }}
              onClick={() => setActiveTab('faculty')}
            >
              👨‍🏫 Faculty Performance
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'student' ? <StudentDashboard /> : <FacultyDashboard />}
      </div>
    </AdminPortal>
  );
};

// Styles
const styles = {
  container: {
    padding: '0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '0 1.5rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    padding: '1.5rem'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#2c3e50',
    margin: '0'
  },
  toggleContainer: {
    display: 'flex',
    background: '#f8f9fa',
    borderRadius: '12px',
    padding: '4px',
    gap: '4px'
  },
  toggleBtn: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    background: 'transparent',
    color: '#6c757d',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem'
  },
  toggleBtnActive: {
    background: '#8B0000',
    color: 'white',
    boxShadow: '0 2px 8px rgba(139, 0, 0, 0.3)'
  }
};

export default AdminDashboard;