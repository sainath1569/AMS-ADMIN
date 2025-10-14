// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn } from './components/AdminLogin'; // Import the helper

// Import your components
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';
import FacultyManagement from './Pages/FacultyPage';
import StudentManagement from './Pages/StudentManagement';
import CrManagement from './Pages/CrManagement';
import SchedulePage from './Pages/SchedulePage';
import AttendanceReport from './Pages/AttendanceReports';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/students" 
          element={
            <ProtectedRoute>
              <StudentManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/faculty" 
          element={
            <ProtectedRoute>
              <FacultyManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
        path="/admin/cr" 
        element={
          <ProtectedRoute>
          <CrManagement/>
          </ProtectedRoute>
        }
        />
        <Route 
          path="/admin/schedule" 
          element={
            <ProtectedRoute>
              <SchedulePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <ProtectedRoute>
              <AttendanceReport />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect /admin to /admin/dashboard if logged in */}
        <Route 
          path="/admin" 
          element={
            isLoggedIn() ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          } 
        />
        
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;