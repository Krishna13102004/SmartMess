import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MinusCircle, Search, X, ChefHat, Utensils, Plus, Trash2, 
  Save, AlertTriangle, FileText, CheckCircle, RotateCcw, History, Clock, Repeat, Download 
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const DailyUsage = () => {
  const [activeTab, setActiveTab] = useState('entry'); 
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [draftLog, setDraftLog] = useState([]); 
  
  // History State
  const [historyLog, setHistoryLog] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [qtyInput, setQtyInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  
  const categories = ['All', 'Grains', 'Oils', 'Vegetables', 'Spices', 'Dairy'];

  // 1. Fetch Inventory
  const fetchInventory = () => {
    axios.get('http://localhost:8080/api/inventory/all')
      .then(res => {
        // 🔥 FIX: Direct List Handling
        const data = res.data || [];
        setItems(data);
        setFilteredItems(data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchInventory(); }, []);

  // 2. Filter Logic
  useEffect(() => {
    let result = items;
    if (activeCategory !== 'All') result = result.filter(i => i.category === activeCategory);
    if (searchTerm) result = result.filter(i => i.itemName.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredItems(result);
  }, [items, searchTerm, activeCategory]);

  // 3. Add to Draft
  const addToDraft = (e) => {
    e.preventDefault();
    if (!qtyInput || qtyInput <= 0) return toast.warning("Enter valid quantity!");
    if (Number(qtyInput) > Number(selectedItem.currentStock)) {
      return toast.error(`⚠️ Insufficient Stock! Only ${selectedItem.currentStock} ${selectedItem.unit} left.`);
    }

    const newItem = {
      id: selectedItem.id,
      itemName: selectedItem.itemName,
      quantity: parseFloat(qtyInput),
      unit: selectedItem.unit,
      currentStock: selectedItem.currentStock, // Store current stock for calculation
      notes: noteInput || 'Regular Usage',
      category: selectedItem.category
    };

    setDraftLog([...draftLog, newItem]);
    setSelectedItem(null);
    setQtyInput('');
    setNoteInput('');
    toast.success("Added to Draft List! 📝");
  };

  // 🔥 4. SUBMIT LOG (FIXED FOR YOUR BACKEND)
  const submitDailyLog = async () => {
    if (draftLog.length === 0) return toast.warning("Draft is empty!");
    
    try {
      // Loop through draft items and update one by one
      for (const log of draftLog) {
        // Calculate New Stock
        const newStock = parseFloat(log.currentStock) - parseFloat(log.quantity);
        
        // Call the EXISTING Backend Endpoint
        await axios.put(`http://localhost:8080/api/inventory/update/${log.id}`, {
          currentStock: newStock,  // Update only stock
          itemName: log.itemName   // Just for safety
        });
      }
      
      // Update History UI
      const currentDate = new Date().toLocaleString();
      const newHistoryEntries = draftLog.map((log, i) => ({
        ...log, 
        id: Date.now() + i, 
        date: currentDate, 
        status: 'Logged'
      }));

      setHistoryLog(prevHistory => [...newHistoryEntries, ...prevHistory]);

      setDraftLog([]); 
      fetchInventory(); // Refresh Stock Data
      toast.success("✅ Daily Usage Logged & Stock Updated!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Error updating database. Check Console.");
    }
  };

  // 5. Repeat Item
  const repeatItem = (histItem) => {
    const stockItem = items.find(i => i.itemName === histItem.itemName);
    if (stockItem) {
      setSelectedItem(stockItem);
      setQtyInput(histItem.quantity);
      setNoteInput(histItem.notes);
      setActiveTab('entry');
      toast.info(`Repopulating ${histItem.itemName}...`);
    } else {
      toast.error("Item not found in current stock.");
    }
  };

  // 6. DOWNLOAD STATEMENT
  const downloadStatement = () => {
    const doc = new jsPDF();
    
    // Header Section
    doc.setFontSize(22);
    doc.setTextColor(22, 163, 74); 
    doc.text("Kitchen Consumption Statement", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 30);
    doc.text("Organization: SMART MESS - Main Kitchen", 14, 35);
    
    doc.setDrawColor(200);
    doc.line(14, 40, 196, 40);

    const tableColumn = ["Date & Time", "Item Name", "Quantity Used", "Usage Reason / Notes"];
    const tableRows = [];

    historyLog.forEach(item => {
      const rowData = [
        item.date,
        item.itemName,
        `${item.quantity} ${item.unit}`,
        item.notes || "-"
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 3 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("--- End of Statement ---", 105, finalY, null, null, "center");

    doc.save(`Kitchen_Statement_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem 4rem 2rem' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* HEADER & TABS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0, background: 'linear-gradient(to right, #16a34a, #15803d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ChefHat size={32} color="#16a34a" /> Kitchen Log
          </h1>
          <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Manage daily consumption & history</p>
        </div>

        <div className="glass-card" style={{ padding: '5px', display: 'flex', gap: '5px', background: '#f1f5f9' }}>
          <button onClick={() => setActiveTab('entry')} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: activeTab === 'entry' ? 'white' : 'transparent', color: activeTab === 'entry' ? '#16a34a' : '#64748b', fontWeight: 'bold', boxShadow: activeTab === 'entry' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> New Entry
          </button>
          <button onClick={() => setActiveTab('history')} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: activeTab === 'history' ? 'white' : 'transparent', color: activeTab === 'history' ? '#16a34a' : '#64748b', fontWeight: 'bold', boxShadow: activeTab === 'history' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} /> History Log
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'entry' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '2rem' }}>
          
          {/* LEFT: INVENTORY */}
          <div>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '12px', gap: '10px', background: 'white', marginBottom: '1.5rem' }}>
              <Search size={20} color="#94a3b8" />
              <input type="text" placeholder="Search Ingredients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #cbd5e1', cursor: 'pointer', background: activeCategory === cat ? '#16a34a' : 'white', color: activeCategory === cat ? 'white' : '#64748b', fontSize: '0.85rem' }}>{cat}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', maxHeight: '550px', overflowY: 'auto' }}>
              {filteredItems.map(item => {
                const isLow = Number(item.currentStock) < Number(item.minLimit);
                return (
                  <motion.div key={item.id} whileHover={{ y: -3 }} className="glass-card" 
                    style={{ padding: '1rem', borderTop: isLow ? '4px solid #ef4444' : '4px solid #16a34a', cursor: 'pointer' }}
                    onClick={() => setSelectedItem(item)}
                  >
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#1e293b' }}>{item.itemName}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Stock: <b>{item.currentStock} {item.unit}</b></span>
                      <Plus size={20} color="#16a34a" style={{ background: '#dcfce7', borderRadius: '50%', padding: '4px' }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: DRAFT LOG */}
          <div className="glass-card" style={{ padding: '1.5rem', height: 'fit-content', background: '#f8fafc' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={20} color="#3b82f6"/> Current Draft
              <span className="badge badge-good" style={{ marginLeft: 'auto' }}>{draftLog.length} Items</span>
            </h3>

            {draftLog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', border: '2px dashed #cbd5e1', borderRadius: '10px' }}>
                <Utensils size={40} style={{ opacity: 0.5, marginBottom: '10px' }} />
                <p>Select items to add.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                {draftLog.map((log, idx) => (
                  <div key={idx} style={{ background: 'white', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, color: '#0f172a' }}>{log.itemName}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                        <span style={{ color: '#16a34a', fontWeight: 'bold' }}>{log.quantity} {log.unit}</span> • {log.notes}
                      </p>
                    </div>
                    <button onClick={() => { const n = [...draftLog]; n.splice(idx,1); setDraftLog(n); }} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', gap: '10px' }}>
               <button onClick={() => setDraftLog([])} disabled={draftLog.length === 0} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Clear</button>
               <button onClick={submitDailyLog} disabled={draftLog.length === 0} style={{ flex: 2, padding: '12px', background: draftLog.length > 0 ? '#16a34a' : '#cbd5e1', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Confirm & Save</button>
            </div>
          </div>
        </div>
      ) : (
        // --- HISTORY TAB ---
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '2rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={22} color="#f59e0b"/> Recent Transactions
            </h3>
            <button 
              onClick={downloadStatement}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', 
                background: '#16a34a', color: 'white', 
                border: 'none', padding: '10px 20px', borderRadius: '10px', 
                cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(22, 163, 74, 0.2)' 
              }}
            >
              <Download size={18} /> Download Statement
            </button>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#64748b', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <th style={{ padding: '15px' }}>Date & Time</th>
                <th style={{ padding: '15px' }}>Item</th>
                <th style={{ padding: '15px' }}>Quantity</th>
                <th style={{ padding: '15px' }}>Notes</th>
                <th style={{ padding: '15px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {historyLog.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '15px', color: '#64748b', fontSize: '0.9rem' }}>{item.date}</td>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#0f172a' }}>{item.itemName}</td>
                  <td style={{ padding: '15px', color: '#16a34a', fontWeight: 'bold' }}>{item.quantity} {item.unit}</td>
                  <td style={{ padding: '15px', color: '#64748b' }}>{item.notes}</td>
                  <td style={{ padding: '15px' }}>
                    <button onClick={() => repeatItem(item)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#f0f9ff', color: '#0ea5e9', border: 'none', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      <Repeat size={14}/> Re-Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {historyLog.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No history found.</p>}
        </motion.div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card" style={{ padding: '2rem', width: '400px', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>Add {selectedItem.itemName}</h3>
                <X style={{ cursor: 'pointer' }} onClick={() => setSelectedItem(null)} />
              </div>
              <form onSubmit={addToDraft}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', color: '#64748b' }}>Quantity ({selectedItem.unit})</label>
                  <input type="number" step="0.1" autoFocus value={qtyInput} onChange={e => setQtyInput(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '5px', fontSize: '1.1rem' }} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.9rem', color: '#64748b' }}>Notes (Optional)</label>
                  <input type="text" placeholder="e.g. Lunch..." value={noteInput} onChange={e => setNoteInput(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '5px' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Add to Draft</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DailyUsage;