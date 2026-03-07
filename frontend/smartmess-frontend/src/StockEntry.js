import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, Search, X, PackagePlus, Save, Zap, Trash2 
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const StockEntry = () => {
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'bulk'
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Bulk State
  const [bulkList, setBulkList] = useState([]);

  // Modal State (Manual)
  const [selectedItem, setSelectedItem] = useState(null);
  const [refillQty, setRefillQty] = useState('');
  const [supplier, setSupplier] = useState(''); 

  // 1. Fetch Inventory
  const fetchInventory = () => {
    axios.get('http://localhost:8080/api/inventory/all')
      .then(res => {
        // FIX: Backend returns a List directly, not wrapped in a 'data' object
        setItems(res.data || []);
        setFilteredItems(res.data || []);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchInventory(); }, []);

  // 2. Filter Logic
  useEffect(() => {
    const result = items.filter(i => 
      i.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(result);
  }, [items, searchTerm]);

  // --- MANUAL ENTRY LOGIC ---
  const handleManualRefill = async (e) => {
    e.preventDefault();
    if (!refillQty || refillQty <= 0) return toast.warning("Enter valid quantity!");

    try {
      // FIX: Calculate new total stock (Current + Refill)
      // Backend 'updateStock' replaces the value, so we must send the sum.
      const newTotalStock = (selectedItem.currentStock || 0) + parseFloat(refillQty);

      // FIX: Use PUT to /api/inventory/update/{id}
      // FIX: Send 'currentStock' key to match InventoryItem.java
      await axios.put(`http://localhost:8080/api/inventory/update/${selectedItem.id}`, {
        currentStock: newTotalStock,
        // Note: 'supplier' is not in InventoryItem.java, so it won't be saved by backend
        // unless you add that field to the Java model.
      });

      toast.success(`✅ Stock Updated: ${selectedItem.itemName}`);
      setSelectedItem(null);
      setRefillQty('');
      setSupplier('');
      fetchInventory();
    } catch (err) {
      console.error(err);
      toast.error("❌ Error updating stock.");
    }
  };

  // --- 🔥 SMART AUTO-FILL (15 DAYS REQUIREMENT) ---
  const loadAutoRefill = () => {
    const suggestions = [];
    
    items.forEach(item => {
      const min = Number(item.minLimit);
      const current = Number(item.currentStock);
      
      // LOGIC: If stock is below Requirement, Fill the Deficit
      if (current < min) {
        const deficit = min - current;
        suggestions.push({
          ...item,
          refillQty: deficit, // Auto-Calculated Quantity
          supplier: 'Auto-Restock'
        });
      }
    });

    if(suggestions.length === 0) {
      toast.success("All stocks are sufficient! Nothing to refill.");
    } else {
      setBulkList(suggestions);
      toast.info(`⚡ Auto-filled ${suggestions.length} items based on deficit!`);
    }
  };

  // Handle Input Change in Bulk List
  const handleBulkChange = (index, field, value) => {
    const updated = [...bulkList];
    updated[index][field] = value;
    setBulkList(updated);
  };

  // Remove item from Bulk List
  const removeBulkItem = (index) => {
    const updated = [...bulkList];
    updated.splice(index, 1);
    setBulkList(updated);
  };

  // Submit All Bulk Items
  const submitBulkRefill = async () => {
    if(bulkList.length === 0) return toast.warning("List is empty!");

    try {
      // Loop and save each item
      for (const item of bulkList) {
        // FIX: Calculate new total stock
        const newTotalStock = (item.currentStock || 0) + parseFloat(item.refillQty);

        // FIX: Use PUT /update/{id} and send 'currentStock'
        await axios.put(`http://localhost:8080/api/inventory/update/${item.id}`, {
          currentStock: newTotalStock
        });
      }
      toast.success("✅ All 15-Day Requirements Refilled!");
      setBulkList([]);
      fetchInventory();
    } catch (err) {
      console.error(err);
      toast.error("❌ Bulk update failed.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem 4rem 2rem' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0, background: 'linear-gradient(to right, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PackagePlus size={32} color="#3b82f6" /> Stock Refill Entry
          </h1>
          <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Manual Entry & Smart Auto-Refill</p>
        </div>

        {/* TAB SWITCHER */}
        <div className="glass-card" style={{ padding: '5px', display: 'flex', gap: '5px', background: '#f1f5f9' }}>
          <button onClick={() => setActiveTab('manual')} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: activeTab === 'manual' ? 'white' : 'transparent', color: activeTab === 'manual' ? '#3b82f6' : '#64748b', fontWeight: 'bold', display: 'flex', gap: '8px' }}>
            <PlusCircle size={18} /> Manual Entry
          </button>
          <button onClick={() => setActiveTab('bulk')} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: activeTab === 'bulk' ? 'white' : 'transparent', color: activeTab === 'bulk' ? '#3b82f6' : '#64748b', fontWeight: 'bold', display: 'flex', gap: '8px' }}>
            <Zap size={18} /> 15-Day Auto Refill
          </button>
        </div>
      </div>

      {/* --- TAB 1: MANUAL ENTRY (Existing) --- */}
      {activeTab === 'manual' && (
        <>
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '12px', gap: '10px', background: 'white', width: '300px', marginBottom: '1.5rem' }}>
            <Search size={20} color="#94a3b8" />
            <input type="text" placeholder="Search Items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredItems.map((item) => (
              <motion.div key={item.id} whileHover={{ y: -5 }} className="glass-card" style={{ padding: '1.5rem', borderTop: '4px solid #3b82f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0, color: '#1e293b' }}>{item.itemName}</h3>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>{item.currentStock} {item.unit}</span>
                </div>
                <button 
                  onClick={() => setSelectedItem(item)}
                  style={{ marginTop: '10px', width: '100%', padding: '10px', background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <PlusCircle size={18} /> Add Stock
                </button>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* --- TAB 2: SMART AUTO REFILL (New Feature) --- */}
      {activeTab === 'bulk' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '2rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ margin: 0, color: '#1e293b' }}>⚡ 15-Day Requirement Auto-Fill</h3>
              <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>Automatically loads items below minimum limit.</p>
            </div>
            
            {/* 🔥 AUTO FILL BUTTON */}
            <button 
              onClick={loadAutoRefill}
              style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)' }}>
              <Zap size={20} /> Auto-Load Deficit
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#64748b', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <th style={{ padding: '15px' }}>Item Name</th>
                <th style={{ padding: '15px' }}>Current Stock</th>
                <th style={{ padding: '15px' }}>Refill Quantity (Auto)</th>
                <th style={{ padding: '15px' }}>Supplier</th>
                <th style={{ padding: '15px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {bulkList.length > 0 ? bulkList.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#0f172a' }}>{item.itemName}</td>
                  <td style={{ padding: '15px', color: '#ef4444' }}>{item.currentStock} {item.unit}</td>
                  
                  {/* Editable Quantity */}
                  <td style={{ padding: '15px' }}>
                    <input 
                      type="number" 
                      value={item.refillQty} 
                      onChange={(e) => handleBulkChange(idx, 'refillQty', e.target.value)}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid #3b82f6', width: '100px', fontWeight: 'bold', color: '#1e293b' }}
                    />
                    <span style={{ marginLeft: '5px', color: '#64748b' }}>{item.unit}</span>
                  </td>

                  {/* Editable Supplier */}
                  <td style={{ padding: '15px' }}>
                     <input 
                      type="text" 
                      value={item.supplier} 
                      onChange={(e) => handleBulkChange(idx, 'supplier', e.target.value)}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '150px' }}
                    />
                  </td>

                  <td style={{ padding: '15px' }}>
                    <button onClick={() => removeBulkItem(idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Click "Auto-Load Deficit" to generate list.</td></tr>
              )}
            </tbody>
          </table>

          {/* CONFIRM BUTTON */}
          {bulkList.length > 0 && (
             <div style={{ marginTop: '2rem', textAlign: 'right' }}>
               <button 
                 onClick={submitBulkRefill}
                 style={{ background: '#16a34a', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                 <Save size={20} /> Confirm & Refill All
               </button>
             </div>
          )}

        </motion.div>
      )}

      {/* MANUAL ENTRY MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card" style={{ padding: '2rem', width: '400px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Restock {selectedItem.itemName}</h3>
                <X style={{ cursor: 'pointer' }} onClick={() => setSelectedItem(null)} />
              </div>
              <form onSubmit={handleManualRefill}>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Quantity to Add ({selectedItem.unit})</label>
                  <input type="number" step="0.1" autoFocus value={refillQty} onChange={e => setRefillQty(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #3b82f6', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label>Supplier (Optional)</label>
                  <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '5px' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Update Stock</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StockEntry;
