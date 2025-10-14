// Pages/AdminLogin.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import logo from '../assests/rgukt_w.png';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const hasProcessedAuth = useRef(false);

  // Authorized admin emails
  const ADMIN_EMAILS = [
    'r210387@rguktrkv.ac.in',
    'admin@rguktrkv.ac.in'
  ];

  // Google OAuth Configuration
  const GOOGLE_CLIENT_ID = '221878465173-tggq7abqtnmn2di7f214lvgaevenk7dn.apps.googleusercontent.com';

  // Handle OAuth callback FIRST - before anything else
  useEffect(() => {
    const hash = window.location.hash;
    
    console.log('🔍 Checking URL hash:', hash);
    
    // If we have an access token and haven't processed it yet
    if (hash && hash.includes('access_token') && !hasProcessedAuth.current) {
      hasProcessedAuth.current = true;
      setIsLoading(true);
      console.log('✅ Access token found, processing authentication...');
      handleOAuthCallback();
    }
  }, []); // Run only once on mount

  // Check if user is already logged in (only if no OAuth callback)
  useEffect(() => {
    const hash = window.location.hash;
    
    // Skip this check if we're handling OAuth
    if (hash && hash.includes('access_token')) {
      console.log('⏭️ Skipping login check - handling OAuth callback');
      return;
    }

    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (ADMIN_EMAILS.includes(user.email)) {
          console.log('✅ User already logged in, redirecting to dashboard');
          navigate('/admin/dashboard', { replace: true });
          return;
        }
      } catch (error) {
        console.error('❌ Invalid stored user data:', error);
        localStorage.removeItem('adminUser');
      }
    }
    
    // Show login card with animation
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleOAuthCallback = async () => {
    try {
      console.log('🔄 Starting OAuth callback processing...');
      
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');

      if (!accessToken) {
        throw new Error('No access token found in URL');
      }

      console.log('✅ Access token extracted successfully');

      // Get user info from Google
      console.log('📡 Fetching user info from Google...');
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!userInfoResponse.ok) {
        throw new Error(`Failed to fetch user info: ${userInfoResponse.status}`);
      }

      const userInfo = await userInfoResponse.json();
      console.log('👤 User info received:', {
        email: userInfo.email,
        name: userInfo.name
      });
      
      // Check college email domain
      if (!userInfo.email.endsWith('@rguktrkv.ac.in')) {
        console.log('❌ Email domain check failed');
        await Swal.fire({
          title: 'Access Denied',
          text: 'Please use your RGUKT RK Valley College email (@rguktrkv.ac.in)',
          icon: 'error',
          confirmButtonColor: '#8B0000'
        });
        
        // Reset and redirect
        hasProcessedAuth.current = false;
        window.history.replaceState(null, '', '/admin/login');
        setIsLoading(false);
        return;
      }

      // Verify email is authorized admin email
      const normalizedEmail = userInfo.email.toLowerCase();
      if (!ADMIN_EMAILS.includes(normalizedEmail)) {
        console.log('❌ Email not in authorized list:', normalizedEmail);
        await Swal.fire({
          title: 'Access Denied',
          text: 'This email is not authorized for admin access.',
          icon: 'error',
          confirmButtonColor: '#8B0000'
        });
        
        // Reset and redirect
        hasProcessedAuth.current = false;
        window.history.replaceState(null, '', '/admin/login');
        setIsLoading(false);
        return;
      }

      // Success - authorized email
      console.log('✅ User authorized successfully');
      const authorizedUser = {
        name: userInfo.name || userInfo.email.split('@')[0],
        email: normalizedEmail,
        picture: userInfo.picture,
        role: 'admin',
        loginTime: new Date().toISOString()
      };
      
      // Store user data
      localStorage.setItem('adminUser', JSON.stringify(authorizedUser));
      console.log('💾 User data stored in localStorage');
      
      // Show success message
      await Swal.fire({
        title: 'Login Successful!',
        text: `Welcome, ${authorizedUser.name}`,
        icon: 'success',
        confirmButtonColor: '#8B0000',
        timer: 1500,
        showConfirmButton: false
      });
      
      // Clear hash from URL
      window.history.replaceState(null, '', '/admin/dashboard');
      
      // Navigate to dashboard
      console.log('🚀 Navigating to dashboard...');
      navigate('/admin/dashboard', { replace: true });
      
    } catch (error) {
      console.error('❌ OAuth error:', error);
      
      await Swal.fire({
        title: 'Login Failed',
        text: error.message || 'Authentication failed. Please try again.',
        icon: 'error',
        confirmButtonColor: '#8B0000'
      });
      
      // Reset everything
      hasProcessedAuth.current = false;
      localStorage.removeItem('adminUser');
      window.history.replaceState(null, '', '/admin/login');
      setIsLoading(false);
      setShowCard(true);
    }
  };

  const handleGoogleLogin = () => {
    console.log('🔐 Initiating Google OAuth...');
    setIsLoading(true);

    const REDIRECT_URI = window.location.origin + '/admin/login';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent('openid profile email')}` +
      `&prompt=select_account`;

    console.log('🔗 Redirect URI:', REDIRECT_URI);
    window.location.href = authUrl;
  };

  const handleBack = () => {
    navigate('/');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4B0000, #8B0000, #C62828)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        color: 'white',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #ffffff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <h2 style={{ margin: 0 }}>Processing Login...</h2>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Please wait while we authenticate your credentials.
        </p>
        <style>
          {`@keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }`}
        </style>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4B0000, #8B0000, #C62828)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)
        `
      }}></div>

      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '1.5rem 2rem',
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="logo-container">
            <img src={logo} alt="RGUKT Logo" className="header-logo" />
            <div className="logo-glow"></div>
          </div>
          <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>
            AMS - RGUKT RKV
          </h1>
        </div>
      </header>

      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transform: showCard ? 'translateY(0)' : 'translateY(30px)',
        opacity: showCard ? 1 : 0,
        transition: 'all 0.5s ease',
        maxWidth: '400px',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#8B0000', fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Admin Login
            </h2>
            <p style={{ color: '#666', fontSize: '1rem', margin: 0 }}>
              Sign in with authorized institutional email
            </p>
          </div>

          <button
            style={{
              width: '100%',
              background: 'white',
              color: '#333',
              border: '2px solid #ddd',
              padding: '1rem 1.5rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: 'pointer',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease'
            }}
            onClick={handleGoogleLogin}
            disabled={isLoading}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#8B0000';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(139, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#ddd';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <img 
              src="https://developers.google.com/identity/images/g-logo.png" 
              alt="Google" 
              style={{ width: '20px', height: '20px' }}
            />
            Sign in with Google
          </button>

          <button 
            style={{
              background: 'transparent',
              color: '#666',
              border: 'none',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              borderRadius: '8px',
              width: '100%'
            }}
            onClick={handleBack}
          >
            ← Back to Home
          </button>

                 </div>
      </div>
    </div>
  );
};

export const logout = () => {
  localStorage.removeItem('adminUser');
  window.location.href = '/admin/login';
};

export const isLoggedIn = () => {
  const storedUser = localStorage.getItem('adminUser');
  if (!storedUser) return false;
  try {
    const user = JSON.parse(storedUser);
    const ADMIN_EMAILS = ['r210387@rguktrkv.ac.in', 'admin@rguktrkv.ac.in'];
    return ADMIN_EMAILS.includes(user.email);
  } catch {
    return false;
  }
};

export default AdminLogin;