// components/AdminPortal.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/AdminPortal.css'; // Add this for better styling

const AdminPortal = ({ children, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/students', icon: '👨‍🎓', label: 'Student Management' },
    { path: '/admin/faculty', icon: '👨‍🏫', label: 'Faculty Management' },
    { path: '/admin/cr', icon: '⭐', label: 'CR Management' },
    { path: '/admin/schedule', icon: '📅', label: 'Schedule' },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8B0000',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Logout!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('adminUser');
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          confirmButtonColor: '#8B0000',
          timer: 2000
        }).then(() => {
          window.location.href = '/admin/login';
        });
      }
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => location.pathname.startsWith(item.path));
    return currentItem ? currentItem.label : 'Dashboard';
  };

  return (
    <div className="admin-portal-container">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="nav-icon">🏛️</div>
            <span className={`logo-text ${isSidebarOpen ? 'visible' : 'hidden'}`}>AMS Admin(Prototype)</span>
          </div>
          
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className={`nav-text ${isSidebarOpen ? 'visible' : 'hidden'}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            <span className="nav-icon">🚪</span>
            <span className={`nav-text ${isSidebarOpen ? 'visible' : 'hidden'}`}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isSidebarOpen ? 'content-with-sidebar' : 'content-full'}`}>
        {/* Top Header */}
        <header className="content-header">
          <div>
            <h1 className="page-title">{getPageTitle()}</h1>
            <p className="page-subtitle">Welcome back, {user?.name || 'Admin'}!</p>
          </div>
          
          <div className="user-info">
            <div className="user-avatar">
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                />
              ) : (
                <span>👤</span>
              )}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name || 'Admin User'}</span>
              <span className="user-role">{user?.role || 'Administrator'}</span>
            </div>
          </div>
        </header>

        {/* Page Content - No extra padding/margin that creates gaps */}
        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;