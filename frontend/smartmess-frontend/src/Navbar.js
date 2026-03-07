import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, UtensilsCrossed, ChefHat, BookOpen, 
  ShoppingCart, Info, FileText, PackagePlus // 👈 IMPORT ICON
} from 'lucide-react'; 
import './App.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav style={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
      padding: '1rem 2rem', 
      background: 'rgba(255,255,255,0.95)', 
      backdropFilter: 'blur(10px)',
      borderBottom: '2px solid #bbf7d0', 
      marginBottom: '2rem',
      position: 'sticky', top: 0, zIndex: 1000,
      boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
    }}>
      {/* LOGO */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ background: '#15803d', padding: '8px', borderRadius: '8px', color: 'white', display: 'flex' }}>
          <ChefHat size={24} />
        </div>
        <h2 style={{ 
          margin: 0, fontSize: '1.6rem', fontWeight: '900', 
          color: '#14532d', letterSpacing: '0.5px', textShadow: '0 2px 0px rgba(0,0,0,0.1)'
        }}>
          SMART MESS
        </h2>
      </div>

      {/* MENU BUTTONS */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
       <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active={location.pathname === '/dashboard'} />
        
        {/* NEW: Stock Entry (Inward) */}
        <NavLink to="/stock-entry" icon={<PackagePlus size={18} />} label="Stock Entry" active={location.pathname === '/stock-entry'} />
        
        <NavLink to="/daily-usage" icon={<UtensilsCrossed size={18} />} label="Daily Usage" active={location.pathname === '/daily-usage'} />
        
        <NavLink to="/procurement" icon={<ShoppingCart size={18} />} label="To-Buy List" active={location.pathname === '/procurement'} />
        
        <NavLink to="/smart-purchase" icon={<FileText size={18} />} label="Purchase Order" active={location.pathname === '/smart-purchase'} />
        
        <NavLink to="/event-prediction" icon={<ChefHat size={18} />} label="Predictor" active={location.pathname === '/event-prediction'} />
        
        <NavLink to="/menu-catalog" icon={<BookOpen size={18} />} label="Menu" active={location.pathname === '/menu-catalog'} />
        
        <NavLink to="/info" icon={<Info size={18} />} label="Info" active={location.pathname === '/info'} />
      </div>
    </nav>
  );
};

// Green Themed Buttons
const NavLink = ({ to, icon, label, active }) => (
  <Link to={to} style={{ 
    textDecoration: 'none', 
    color: active ? '#14532d' : '#64748b', 
    display: 'flex', alignItems: 'center', gap: '8px', 
    padding: '8px 16px', borderRadius: '12px',
    background: active ? '#dcfce7' : 'transparent', 
    border: active ? '1px solid #16a34a' : '1px solid transparent',
    transition: 'all 0.3s ease',
    fontWeight: active ? '700' : '600'
  }}>
    {icon} {label}
  </Link>
);

export default Navbar;