import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, AlertTriangle, DollarSign, Activity, Search, Filter, ArrowUpDown, AlertOctagon, X } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('normal');
  const [showLowStockDetails, setShowLowStockDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH & REAL-TIME ALERTS ---
  useEffect(() => {
    axios.get('http://localhost:8080/api/inventory/all')
      .then(res => {
        // 🔥 FIXED: Backend sends a direct List, not inside 'data' object
        const data = res.data || []; 
        
        console.log("✅ Data Received:", data); // Debugging
        setItems(data);
        setFilteredItems(data);
        setLoading(false);

        // 🔥 LOGIC: Check for Low Stock & Trigger Alert
        // Default minLimit 10 if missing
        const lowItems = data.filter(i => Number(i.currentStock) < Number(i.minLimit || 10));
        
        if (lowItems.length > 0) {
          toast.error(`⚠️ Warning: ${lowItems.length} items are running low!`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
          setShowLowStockDetails(true);
        }
      })
      .catch(err => {
        console.error("❌ Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // --- 2. FILTER & SORT ---
  useEffect(() => {
    let result = items;
    if (activeCategory !== 'All') {
      result = result.filter(item => item.category === activeCategory);
    }
    if (searchTerm) {
      result = result.filter(item => item.itemName.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (sortOrder === 'low') {
      result = [...result].sort((a, b) => Number(a.currentStock) - Number(b.currentStock));
    }
    setFilteredItems(result);
  }, [items, searchTerm, activeCategory, sortOrder]);


  // --- 3. DYNAMIC CALCULATIONS ---
  const totalItems = items.length;
  // Handle missing minLimit safely
  const lowStockItems = items.filter(i => Number(i.currentStock) < Number(i.minLimit || 10));
  const lowStockCount = lowStockItems.length;
  
  // Total Value Calculation
  const totalStockValue = items.reduce((acc, item) => acc + (Number(item.currentStock) * 50), 0); 

  // 🔥 LOGIC: Dynamic Today's Usage
  const todaysUsage = items.reduce((acc, item) => {
    const min = Number(item.minLimit || 10);
    const current = Number(item.currentStock || 0);
    const estimatedStart = min * 3; 
    
    let used = estimatedStart - current;
    if (used < 0) used = 0; 
    
    return acc + used;
  }, 0);

  const categories = ['All', ...new Set(items.map(i => i.category))];

  // PDF Download
  const downloadLowStockPDF = () => {
    const doc = new jsPDF();
    doc.text("Urgent Purchase List", 14, 20);
    const rows = lowStockItems.map(i => [i.itemName, i.currentStock, "Buy Now"]);
    autoTable(doc, { head: [["Item", "Stock", "Action"]], body: rows, theme: 'grid', headStyles: { fillColor: [239, 68, 68] } });
    doc.save("Low_Stock.pdf");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem 4rem 2rem' }}>
      <ToastContainer />

      {/* HEADER */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: 0, background: 'linear-gradient(to right, #16a34a, #15803d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🚀 Manager Dashboard
        </h1>
        <p style={{ color: '#64748b' }}>Live Inventory & Status Overview</p>
      </div>

      {/* KPI STRIP */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <KpiCard title="Stock Value" value={`₹${totalStockValue.toLocaleString()}`} icon={<DollarSign color="#16a34a"/>} bg="#dcfce7" />
        
        {/* Low Stock Card */}
        <div onClick={() => setShowLowStockDetails(!showLowStockDetails)} style={{ cursor: 'pointer' }}>
          <KpiCard 
            title="Low Stock" 
            value={lowStockCount} 
            icon={<AlertTriangle color="#ef4444"/>} 
            bg="#fee2e2" 
            valueColor={lowStockCount > 0 ? "#ef4444" : "#0f172a"} 
            isInteractive={true} 
          />
        </div>
        
        <KpiCard 
          title="Today's Usage" 
          value={`${Math.round(todaysUsage)} kg`} 
          icon={<Activity color="#3b82f6"/>} 
          bg="#dbeafe" 
        />
        
        <KpiCard title="Total Items" value={totalItems} icon={<Package color="#f59e0b"/>} bg="#fef3c7" />
      </div>

      {/* DYNAMIC LOW STOCK LIST */}
      <AnimatePresence>
        {showLowStockDetails && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', marginBottom: '2rem' }}
          >
            <div style={{ 
              background: '#fff1f2', border: '1px solid #fda4af', borderLeft: '6px solid #e11d48',
              borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: '#9f1239', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertOctagon size={22} /> Action Required: Low Stock Items
                </h3>
                <button onClick={() => setShowLowStockDetails(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9f1239' }}><X size={20}/></button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {lowStockItems.length > 0 ? lowStockItems.map(item => (
                  <div key={item.id} style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'white', border: '1px solid #f43f5e', 
                    padding: '8px 16px', borderRadius: '30px', 
                    color: '#881337', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(225, 29, 72, 0.1)'
                  }}>
                    <span>{item.itemName}</span>
                    <span style={{ fontSize: '0.85rem', color: '#e11d48', background: '#ffe4e6', padding: '2px 8px', borderRadius: '10px' }}>
                      {item.currentStock} / {item.minLimit || 10} {item.unit}
                    </span>
                  </div>
                )) : <p style={{ color: '#166534', fontWeight: 'bold' }}>✅ All Stocks are sufficient!</p>}
              </div>
              
              {lowStockItems.length > 0 && (
                 <button onClick={downloadLowStockPDF} style={{ marginTop: '10px', padding: '8px 15px', backgroundColor: '#e11d48', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: 'fit-content' }}>
                    📥 Download PDF Report
                 </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH & FILTERS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '10px 15px', gap: '10px', background: 'white', width: '300px' }}>
          <Search size={18} color="#94a3b8" />
          <input type="text" placeholder="Search item..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: '#1e293b' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems:'center' }}>
          <Filter size={18} color="#64748b" />
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #16a34a', cursor: 'pointer', background: activeCategory === cat ? '#16a34a' : 'white', color: activeCategory === cat ? 'white' : '#16a34a', fontWeight: 'bold', fontSize: '0.85rem' }}>{cat}</button>
          ))}
          <div style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 10px' }}></div>
          <button onClick={() => setSortOrder(sortOrder === 'normal' ? 'low' : 'normal')} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', borderRadius: '20px', border: '1px solid #cbd5e1', cursor: 'pointer', background: sortOrder === 'low' ? '#fef3c7' : 'white', color: '#1e293b' }}>
            <ArrowUpDown size={16} /> {sortOrder === 'low' ? 'Lowest First' : 'Sort'}
          </button>
        </div>
      </div>

      {/* INVENTORY CARDS */}
      <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>📦 Live Stock ({filteredItems.length})</h3>
      
      {loading ? <p>Loading Data...</p> : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {filteredItems.map(item => {
          const current = Number(item.currentStock);
          const min = Number(item.minLimit || 10); // Default if missing
          let color = '#16a34a'; let text = 'Good'; let bg = '#dcfce7';
          
          if (current < min) { color = '#ef4444'; text = 'Critical'; bg='#fee2e2'; }
          else if (current < min * 1.5) { color = '#facc15'; text = 'Medium'; bg='#fef9c3'; }
          
          const percent = Math.min((current / (min * 4)) * 100, 100);

          return (
            <motion.div layout key={item.id} whileHover={{ y: -5 }} className="glass-card" style={{ padding: '1.5rem', borderTop: `4px solid ${color}`, background: 'white', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>{item.itemName}</h3>
                <span style={{ background: bg, color: color, padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold' }}>{text}</span>
              </div>
              <h2 style={{ fontSize: '2rem', margin: '10px 0', color: '#0f172a' }}>
                {item.currentStock} <span style={{ fontSize: '1rem', color: '#64748b' }}>{item.unit}</span>
              </h2>
              <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '10px' }}>
                <div style={{ width: `${percent}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.5s ease' }}></div>
              </div>
            </motion.div>
          );
        })}
      </div>
      )}
    </motion.div>
  );
};

const KpiCard = ({ title, value, icon, bg, valueColor = '#0f172a', isInteractive }) => (
  <motion.div whileHover={isInteractive ? { scale: 1.05, cursor: 'pointer' } : {}} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
    <div style={{ padding: '12px', borderRadius: '12px', background: bg }}>{icon}</div>
    <div>
      <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{title}</p>
      <h2 style={{ margin: 0, fontSize: '1.8rem', color: valueColor }}>{value}</h2>
    </div>
  </motion.div>
);

export default Dashboard;