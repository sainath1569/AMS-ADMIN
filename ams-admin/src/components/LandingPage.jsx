// components/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import logo from '../assests/rgukt_w.png'; // Ensure you have a logo image in the specified path
// ProtectedRoute component
import { isLoggedIn } from './AdminLogin';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/admin" replace />;
};
const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Header */}
      <header className="landing-header">
        <div className="header-content">
          <div className="logo-container">
            <img 
              src={logo} 
              alt="RGUKT Logo" 
              className="header-logo"
            />
            <div className="logo-glow"></div>
          </div>
          <h1 className="header-title">
            <span className="title-main1">AMS</span>
            <span className="title-sub">RGUKT RK Valley</span>
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="landing-main">
        <div className={`hero-container ${isVisible ? 'visible' : ''}`}>
          <div className="hero-content">
            <div className="hero-text">
              <div className="welcome-badge">
                <span className="badge-icon">🏛️</span>
                Institutional Admin Portal
              </div>
              
              <h1 className="hero-title">
                Welcome to 
                <span className="highlight"> AMS Portal</span>
              </h1>
              
              <h2 className="hero-subtitle">
                RGUKT RK Valley Administration System
              </h2>
              
              <p className="hero-description">
                Comprehensive management platform for academic administration, 
                faculty coordination, student management, and institutional operations.
              </p>

              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">4,000+</div>
                  <div className="stat-label">Students</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">150+</div>
                  <div className="stat-label">Faculty</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Courses</div>
                </div>
              </div>

              <div className="cta-section">
                <button 
                  className="admin-login-btn primary"
                  onClick={() => navigate('/admin/login')}
                >
                  <span className="btn-icon">🔐</span>
                  Admin Portal Login
                </button>
                
                <div className="security-badge">
                  <span className="security-icon">🛡️</span>
                  Secure Institutional Access Only
                </div>
              </div>
            </div>

            {/* Right Side - AMS-RKV Text */}
            <div className="hero-visual">
              <div className="ams-text-container">
                <div className="ams-text">
                  <span className="ams-text-line ams-text-1">A</span>
                  <span className="ams-text-line ams-text-2">M</span>
                  <span className="ams-text-line ams-text-3">S</span>
                  <span className="ams-text-dash">-</span>
                  <span className="ams-text-line ams-text-4">R</span>
                  <span className="ams-text-line ams-text-5">K</span>
                  <span className="ams-text-line ams-text-6">V</span>
                </div>
                <div className="ams-subtitle">
                  Attendance Management System
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-info">
            <p className="footer-text">
              &copy; 2025 Rajiv Gandhi University of Knowledge Technologies, RK Valley
            </p>
          </div>
          <div className="footer-badge">
            <span className="version">v0.1</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;