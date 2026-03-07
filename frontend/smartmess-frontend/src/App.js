import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import DailyUsage from './DailyUsage';
import Procurement from './Procurement'; 
import SmartProcurement from './SmartProcurement'; 
import EventPrediction from './EventPrediction';
import MenuCatalog from './MenuCatalog';
import InfoModule from './InfoModule';
import StockEntry from './StockEntry'; 
import LandingPage from './LandingPage'; 
import LoginPage from './LoginPage';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  
  // 🔥 UPDATED LOGIC: Landing page ('/') AND Login page ('/login') rendu layum Navbar-a hide pannidum 🔥
  const showNavbar = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/daily-usage" element={<DailyUsage />} />
        <Route path="/procurement" element={<Procurement />} />
        <Route path="/smart-purchase" element={<SmartProcurement />} />
        <Route path="/stock-entry" element={<StockEntry />} />
        <Route path="/event-prediction" element={<EventPrediction />} />
        <Route path="/menu-catalog" element={<MenuCatalog />} />
        <Route path="/info" element={<InfoModule />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;