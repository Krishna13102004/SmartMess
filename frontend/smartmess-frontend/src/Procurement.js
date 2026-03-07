import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShoppingCart, Download, AlertTriangle, CheckCircle, Calendar, Package } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './App.css';

const Procurement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Live Stock
  useEffect(() => {
    axios.get('http://localhost:8080/api/inventory/all')
      .then(res => {
        // 🔥 ERROR FIXED HERE:
        // Backend direct List anupputhu, so 'res.data' podanum. 'res.data.data' thappu.
        const data = res.data || []; 
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // 2. Calculation Logic
  const calculateNeeds = (item) => {
    // Safety check: If minLimit is missing, treat as 0
    const requiredStock = Number(item.minLimit || 0); 
    const currentStock = Number(item.currentStock || 0);
    
    // To Buy = Required - Current
    let toBuy = requiredStock - currentStock;
    if (toBuy < 0) toBuy = 0;

    return {
      req15: requiredStock,
      toBuy: toBuy,
      status: toBuy > 0 ? "Purchase Needed" : "Sufficient"
    };
  };

  // 3. Generate PDF Report
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Procurement Catalog (Stock Re-Order List)", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["Item Name", "Current Stock", "Required (Min Limit)", "TO BUY", "Status"];
    const tableRows = [];

    items.forEach(item => {
      const calc = calculateNeeds(item);
      
      // Filter: PDF la ellame venuma illana Urgent mattuma?
      // Ippa ellathayum podurom for checking.
      if (calc.toBuy > 0) { 
        const rowData = [
          item.itemName,
          `${item.currentStock} ${item.unit}`,
          `${calc.req15} ${item.unit}`,
          `${calc.toBuy} ${item.unit}`,
          "URGENT"
        ];
        tableRows.push(rowData);
      }
    });

    if (tableRows.length === 0) {
      alert("✅ Everything is Sufficient! No Purchase Needed.");
      return;
    }

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [239, 68, 68] },
    });

    doc.save(`Procurement_List.pdf`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 50px 1rem' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0, background: 'linear-gradient(to right, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Procurement Planner
          </h1>
          <p style={{ color: '#64748b', display:'flex', alignItems:'center', gap:'8px', marginTop:'5px' }}>
            <Calendar size={16}/> Items below minimum limit (Re-order List)
          </p>
        </div>

        <button 
          onClick={downloadPDF}
          style={{ 
            background: '#ef4444', color: 'white', border: 'none', 
            padding: '12px 25px', borderRadius: '50px', cursor: 'pointer', display: 'flex', 
            alignItems: 'center', gap: '10px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Download size={20} /> Download List (PDF)
        </button>
      </div>

      {/* LIST VIEW (TABLE) */}
      <div className="glass-card" style={{ overflowX: 'auto', padding: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
              <th style={{ padding: '1.5rem' }}>Item Details</th>
              <th style={{ padding: '1.5rem' }}>Current Stock</th>
              <th style={{ padding: '1.5rem' }}>Required (Min Limit)</th>
              <th style={{ padding: '1.5rem', color: '#ef4444' }}>TO BUY (Deficit)</th>
              <th style={{ padding: '1.5rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const calc = calculateNeeds(item);
              const isUrgent = calc.status === "Purchase Needed";

              // Only show items that need purchase? 
              // Remove this "if" condition if you want to see ALL items.
              if (!isUrgent) return null; 

              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', background: isUrgent ? '#fef2f2' : 'transparent' }}>
                  
                  {/* Item Name */}
                  <td style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ padding: '8px', background: isUrgent ? '#fee2e2' : '#dcfce7', borderRadius: '8px' }}>
                        <Package size={20} color={isUrgent ? '#ef4444' : '#16a34a'} />
                      </div>
                      <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1e293b' }}>{item.itemName}</span>
                    </div>
                  </td>
                  
                  {/* Current Stock */}
                  <td style={{ padding: '1.5rem', color: '#64748b' }}>
                    {item.currentStock} {item.unit}
                  </td>
                  
                  {/* Required */}
                  <td style={{ padding: '1.5rem', color: '#3b82f6', fontWeight: 'bold' }}>
                      {calc.req15} {item.unit}
                  </td>
                  
                  {/* To Buy */}
                  <td style={{ padding: '1.5rem', fontSize: '1.2rem', fontWeight: 'bold', color: isUrgent ? '#ef4444' : '#94a3b8' }}>
                    {isUrgent ? `+${calc.toBuy} ${item.unit}` : '-'}
                  </td>
                  
                  {/* Status */}
                  <td style={{ padding: '1.5rem' }}>
                    <span className={`badge ${isUrgent ? 'badge-low' : 'badge-good'}`} style={{ display:'flex', alignItems:'center', gap:'5px', width:'fit-content' }}>
                      {isUrgent ? <AlertTriangle size={14}/> : <CheckCircle size={14}/>}
                      {isUrgent ? 'Purchase Needed' : 'Sufficient'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Empty State */}
        {items.length === 0 && !loading && (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No items found in database.</p>
        )}
      </div>

    </motion.div>
  );
};

export default Procurement;