import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Info, Download, AlertCircle, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './App.css';

const InfoModule = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data
  useEffect(() => {
    axios.get('http://localhost:8080/api/inventory/all')
      .then(res => {
        // 🔥 ERROR FIXED: Use 'res.data' directly (backend sends a List)
        const data = res.data || [];
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // 2. LOGIC FIX: Direct Database Value (Safety Added)
  const getForecast = (item) => {
    // 🔥 Safety Check: If minLimit is missing, treat as 0
    const requiredStock = Number(item.minLimit || 0); 
    const currentStock = Number(item.currentStock || 0);
    
    // Status Logic
    const isShortage = currentStock < requiredStock;

    return {
      needed: requiredStock, // Showing exact DB value
      status: isShortage ? "Shortage" : "Sufficient",
      isShortage: isShortage
    };
  };

  // 3. Download PDF
  const downloadReport = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Stock Requirement Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["Item Name", "Current Stock", "Required (Min Limit)", "Status"];
    const tableRows = [];

    items.forEach(item => {
      const calc = getForecast(item);
      const rowData = [
        item.itemName,
        `${item.currentStock} ${item.unit}`,
        `${calc.needed} ${item.unit}`,
        calc.status
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save("Requirement_Report.pdf");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem 50px 1rem' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0, background: 'linear-gradient(to right, #16a34a, #15803d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Requirement Info Center
        </h1>
        <p style={{ color: '#64748b', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
          <Info size={18}/> Stock vs Requirement (As per DB Limit)
        </p>
      </div>

      {/* DOWNLOAD BUTTON */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button onClick={downloadReport} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          <Download size={18} /> Download PDF
        </button>
      </div>

      {/* INFO TABLE */}
      <div className="glass-card" style={{ overflowX: 'auto', padding: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
              <th style={{ padding: '1.2rem' }}>Item Name</th>
              <th style={{ padding: '1.2rem' }}>Current Stock</th>
              <th style={{ padding: '1.2rem' }}>Required (Min Limit)</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const calc = getForecast(item);

              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  
                  {/* Item Name */}
                  <td style={{ padding: '1.2rem', fontWeight: 'bold', color: '#1e293b' }}>{item.itemName}</td>
                  
                  {/* Current */}
                  <td style={{ padding: '1.2rem', color: '#64748b' }}>{item.currentStock} {item.unit}</td>
                  
                  {/* Required */}
                  <td style={{ padding: '1.2rem', color: '#2563eb', fontWeight:'bold' }}>{calc.needed} {item.unit}</td>
                  
                  {/* Status */}
                  <td style={{ padding: '1.2rem' }}>
                    <span className={`badge ${calc.isShortage ? 'badge-low' : 'badge-good'}`} style={{ display:'inline-flex', alignItems:'center', gap:'5px' }}>
                      {calc.isShortage ? <AlertCircle size={14}/> : <CheckCircle size={14}/>}
                      {calc.status}
                    </span>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
        
        {items.length === 0 && !loading && (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No items found in database.</p>
        )}
      </div>


    </motion.div>
  );
};

export default InfoModule;