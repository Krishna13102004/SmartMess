import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Lock, User, ArrowRight, ShieldCheck, Home } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle Mock Login for Demo
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (email === 'admin' && password === 'admin123') {
      navigate('/dashboard'); // Admin goes to Dashboard
    } else if (email === 'staff' && password === 'staff123') {
      navigate('/stock-entry'); // Staff goes to Entry portal
    } else {
      setError('Invalid Credentials. Please use the demo accounts.');
    }
  };

  // --- NEW: Floating Particles Animation ---
  const particles = Array.from({ length: 15 }); // Create 15 particles

  const particleAnim = {
    y: [0, -100, 0], // Move up and then back down
    x: [0, 20, -20, 0], // Slight horizontal drift
    opacity: [0, 0.8, 0], // Fade in and out
    transition: {
      duration: Math.random() * 5 + 5, // Random duration between 5s and 10s
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
      delay: Math.random() * 2, // Random delay
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 font-sans" style={{ backgroundColor: '#f8f9fa' }}>
      
      {/* --- HEADER (Landing Page Style) --- */}
      <nav className="navbar px-4 py-3 shadow-sm sticky-top" style={{ backgroundColor: '#ffffff', zIndex: 1000 }}>
        <div className="container">
          <div className="d-flex align-items-center gap-2" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }} className="bg-success rounded p-1 d-flex align-items-center justify-content-center">
               <ChefHat size={28} className="text-white" />
            </motion.div>
            <h3 className="mb-0 fw-bold text-success" style={{ letterSpacing: '1px' }}>SMART MESS</h3>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <button onClick={() => navigate('/')} className="btn btn-outline-success fw-bold px-4 shadow-sm d-flex align-items-center gap-2">
              <Home size={18} /> <span className="d-none d-sm-inline">Back to Home</span>
            </button>
          </div>
        </div>
      </nav>

      {/* --- SPLIT LOGIN SCREEN --- */}
      <div className="container-fluid d-flex flex-grow-1 p-0">
        <div className="row g-0 w-100">
          
          {/* --- LEFT SIDE: Photo + Looping Animation --- */}
          <div className="col-lg-6 d-none d-lg-flex position-relative overflow-hidden align-items-center justify-content-center" 
               style={{ 
                 backgroundImage: `linear-gradient(rgba(4, 30, 18, 0.85), rgba(0, 230, 118, 0.8)), url('https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=2070&auto=format&fit=crop')`,
                 backgroundSize: 'cover', backgroundPosition: 'center' 
               }}>
            
            {/* --- 🔥 NEW: Floating Particles 🔥 --- */}
            <div className="particle-container position-absolute w-100 h-100" style={{ pointerEvents: 'none' }}>
              {particles.map((_, index) => (
                <motion.div
                  key={index}
                  className="particle bg-white rounded-circle position-absolute opacity-50"
                  style={{
                    width: `${Math.random() * 10 + 5}px`, // Random size
                    height: `${Math.random() * 10 + 5}px`,
                    top: `${Math.random() * 100}%`, // Random start position
                    left: `${Math.random() * 100}%`,
                    filter: 'blur(1px)',
                  }}
                  animate={particleAnim}
                />
              ))}
            </div>

            {/* Left Panel Content */}
            <div className="text-center text-white z-index-1 px-5 position-relative">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8, type: "spring" }} className="mb-4 d-inline-block bg-white bg-opacity-10 p-4 rounded-circle backdrop-blur">
                <ChefHat size={64} className="text-white" />
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="display-4 fw-bolder mb-3">
                Smart-Mess ERP
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lead text-white-50 max-w-md mx-auto">
                Secure access to your intelligent inventory and AI demand forecasting dashboard.
              </motion.p>
            </div>
          </div>

          {/* --- RIGHT SIDE: Login Form --- */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center p-4 p-sm-5 bg-white">
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="w-100" style={{ maxWidth: '420px' }}>
              
              <div className="text-center mb-5 d-lg-none">
                <div className="bg-success text-white p-3 rounded-circle d-inline-block mb-3"><ChefHat size={32} /></div>
                <h2 className="fw-bolder text-success">Smart-Mess</h2>
              </div>

              <div className="mb-4">
                <h2 className="fw-bold mb-2 text-dark">Welcome Back</h2>
                <p className="text-muted">Please sign in to your account</p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="alert alert-danger py-2 small fw-bold text-center">
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary small">Username / User ID</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><User size={18} /></span>
                    <input 
                      type="text" 
                      className="form-control bg-light border-start-0 py-2" 
                      placeholder="Enter admin or staff"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary small">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0 text-muted"><Lock size={18} /></span>
                    <input 
                      type="password" 
                      className="form-control bg-light border-start-0 py-2" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-success w-100 py-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2 transition" style={{ fontSize: '1.1rem' }}>
                  Sign In <ArrowRight size={20} />
                </button>
              </form>

              {/* --- DEMO CREDENTIALS BOX --- */}
              <div className="mt-5 p-4 rounded-4 bg-light border border-secondary border-opacity-25">
                <div className="d-flex align-items-center gap-2 mb-3 text-secondary">
                  <ShieldCheck size={18} className="text-success" />
                  <span className="fw-bold text-uppercase" style={{ fontSize: '12px', letterSpacing: '1px' }}>Demo Credentials</span>
                </div>
                
                <div className="row g-3">
                  <div className="col-6">
                    <div className="p-2 border rounded bg-white text-center cursor-pointer" onClick={() => {setEmail('admin'); setPassword('admin123');}} title="Click to auto-fill">
                      <div className="fw-bold text-dark small">Admin</div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>ID: admin <br/> Pass: admin123</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 border rounded bg-white text-center cursor-pointer" onClick={() => {setEmail('staff'); setPassword('staff123');}} title="Click to auto-fill">
                      <div className="fw-bold text-dark small">Staff</div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>ID: staff <br/> Pass: staff123</div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: '11px' }}>*Click on the boxes above to auto-fill the form.</p>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
      
      <style>{`
        .backdrop-blur { backdrop-filter: blur(10px); }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default LoginPage;