import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  FileText, TrendingUp, DollarSign, Users, Truck, Star, 
  CreditCard, ShoppingCart, CheckCircle, AlertTriangle 
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './App.css';

const SmartProcurement = () => {
  const [items, setItems] = useState([]);
  const [purchaseList, setPurchaseList] = useState([]);
  const [budgetLimit, setBudgetLimit] = useState(50000); // Monthly Budget

  // --- 1. MOCK SUPPLIER DB ---
  const suppliersDB = [
    { id: 1, name: "Fresh Farms Ltd", rating: 4.8, delivery: "1 Day", items: { "Rice": 45, "Basmati Rice": 90, "Idli Rice": 38, "Vegetables": 40 } },
    { id: 2, name: "Wholesale Traders", rating: 4.2, delivery: "2 Days", items: { "Rice": 42, "Wheat Flour": 35, "Maida": 30, "Oil": 110, "Dal": 85 } },
    { id: 3, name: "City Supermarket", rating: 4.5, delivery: "1 Day", items: { "Milk": 50, "Curd": 60, "Paneer": 320, "Spices": 400, "Sugar": 42 } },
    { id: 4, name: "Best Price Mart", rating: 3.9, delivery: "3 Days", items: { "Rice": 40, "Oil": 105, "Dal": 80, "Rava (Sooji)": 40, "Vermicelli": 35 } }
  ];

  // --- 2. FETCH & CALCULATE ---
  useEffect(() => {
    axios.get('http://localhost:8080/api/inventory/all')
      .then(res => {
        // 🔥 ERROR FIXED: Use 'res.data' directly (not res.data.data)
        const inventoryData = res.data || [];
        setItems(inventoryData);
        generateSmartPurchaseList(inventoryData);
      })
      .catch(err => console.error(err));
  }, []);

  // --- 3. AI ALGORITHM ---
  const generateSmartPurchaseList = (inventory) => {
    const plannedPurchases = [];
    
    inventory.forEach(item => {
      // Safety Check: Ensure numeric values
      const min = Number(item.minLimit || 0);
      const current = Number(item.currentStock || 0);
      
      if (current < min) {
        const requiredQty = min - current;
        
        // Find Best Supplier (AI Logic)
        let bestSupplier = null;
        let bestPrice = Infinity;

        suppliersDB.forEach(sup => {
          // Case-insensitive match for Item Name
          const supplierPrice = sup.items[item.itemName] || sup.items[Object.keys(sup.items).find(key => key.toLowerCase() === item.itemName.toLowerCase())];

          if (supplierPrice && supplierPrice < bestPrice) {
            bestPrice = supplierPrice;
            bestSupplier = sup;
          }
        });

        // Fallback if no supplier found
        if (!bestSupplier) {
          bestSupplier = { name: "Local Market", rating: 3.0, delivery: "Immediate" };
          bestPrice = 50; // Standard Avg Price
        }

        plannedPurchases.push({
          ...item,
          toBuy: requiredQty,
          supplier: bestSupplier,
          pricePerUnit: bestPrice,
          totalCost: requiredQty * bestPrice
        });
      }
    });
    setPurchaseList(plannedPurchases);
  };

  const totalEstimatedCost = purchaseList.reduce((acc, item) => acc + item.totalCost, 0);
  const budgetStatus = totalEstimatedCost > budgetLimit ? "Critical" : "Safe";
  const budgetColor = budgetStatus === "Critical" ? "#ef4444" : "#16a34a";

  // --- 4. PO PDF GENERATOR ---
  const generatePO = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(22, 163, 74);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("SMART MESS - PURCHASE ORDER", 14, 20);

    // Meta Data
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`PO #: PO-${Date.now().toString().slice(-6)}`, 14, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 45);

    // Table Data
    const tableColumn = ["Item", "Qty", "Supplier", "Rate", "Total", "Delivery"];
    const tableRows = purchaseList.map(item => [
      item.itemName, 
      `${item.toBuy} ${item.unit}`, 
      item.supplier.name, 
      `Rs.${item.pricePerUnit}`, 
      `Rs.${item.totalCost}`, 
      item.supplier.delivery
    ]);

    autoTable(doc, { 
      head: [tableColumn], 
      body: tableRows, 
      startY: 55, 
      theme: 'grid', 
      headStyles: { fillColor: [22, 163, 74] } 
    });

    // Footer - Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Estimated Cost: Rs. ${totalEstimatedCost.toLocaleString()}`, 140, finalY);

    if (totalEstimatedCost > budgetLimit) {
      doc.setTextColor(220, 38, 38);
      doc.text("(⚠️ Budget Exceeded)", 140, finalY + 7);
    }
    
    doc.save(`Official_PO_${Date.now()}.pdf`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 2rem 4rem 2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0, background: 'linear-gradient(to right, #2563eb, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Smart Purchase Manager
          </h1>
          <p style={{ color: '#64748b', marginTop:'5px' }}>AI Supplier Selection & Budget Control</p>
        </div>
        <button onClick={generatePO} disabled={purchaseList.length === 0} style={{ background: purchaseList.length > 0 ? '#2563eb' : '#cbd5e1', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', gap: '10px' }}>
          <FileText size={20} /> Generate Official PO
        </button>
      </div>

      {/* STATS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: `5px solid ${budgetColor}` }}>
          <p style={{ margin: 0, color: '#64748b' }}>Total Cost</p>
          <h2 style={{ fontSize: '2rem', margin: '5px 0', color: '#1e293b' }}>₹{totalEstimatedCost.toLocaleString()}</h2>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: `5px solid ${budgetColor}` }}>
          <p style={{ margin: 0, color: '#64748b' }}>Budget Status</p>
          <h2 style={{ fontSize: '2rem', margin: '5px 0', color: budgetColor }}>{budgetStatus}</h2>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '5px solid #f59e0b' }}>
          <p style={{ margin: 0, color: '#64748b' }}>Items to Buy</p>
          <h2 style={{ fontSize: '2rem', margin: '5px 0', color: '#1e293b' }}>{purchaseList.length}</h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="glass-card" style={{ overflowX: 'auto', padding: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
              <th style={{ padding: '1rem' }}>Item</th>
              <th style={{ padding: '1rem' }}>Supplier (AI)</th>
              <th style={{ padding: '1rem' }}>Rate</th>
              <th style={{ padding: '1rem' }}>Total</th>
              <th style={{ padding: '1rem' }}>Delivery</th>
            </tr>
          </thead>
          <tbody>
            {purchaseList.length > 0 ? purchaseList.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem' }}>
                    <b>{item.itemName}</b><br/>
                    <span style={{fontSize:'0.8rem', color:'#ef4444'}}>Need: {item.toBuy} {item.unit}</span>
                </td>
                <td style={{ padding: '1rem' }}>
                    <b>{item.supplier.name}</b><br/>
                    <span style={{fontSize:'0.8rem', color:'#f59e0b'}}>★ {item.supplier.rating}</span>
                </td>
                <td style={{ padding: '1rem' }}>₹{item.pricePerUnit}</td>
                <td style={{ padding: '1rem', color:'#16a34a', fontWeight:'bold' }}>₹{item.totalCost.toLocaleString()}</td>
                <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Truck size={14} /> {item.supplier.delivery}
                    </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{padding:'3rem', textAlign:'center', color: '#94a3b8'}}>
                   <CheckCircle size={40} style={{marginBottom:'10px', color: '#16a34a'}} /><br/>
                   All Stocks are Sufficient! No Purchases Needed ✅
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default SmartProcurement;