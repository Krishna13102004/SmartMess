import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ChefHat, ArrowRight, ArrowLeft, Download, CheckCircle, Search, Utensils 
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './App.css';

// --- 🧠 RECIPE DATABASE (With Descriptions for Catalog Look) ---
const RECIPE_DB = {
  "Chicken Biryani": { 
    ingredients: [{ name: "Rice", qty: 0.25 }, { name: "Chicken", qty: 0.2 }, { name: "Oil", qty: 0.05 }, { name: "Spices", qty: 0.02 }],
    baseCost: 180,
    desc: "Classic Malabar style chicken biryani with raita.", category: "Main"
  },
  "Mutton Biryani": { 
    ingredients: [{ name: "Rice", qty: 0.25 }, { name: "Mutton", qty: 0.2 }, { name: "Oil", qty: 0.05 }, { name: "Spices", qty: 0.03 }],
    baseCost: 240,
    desc: "Rich and spicy mutton biryani cooked with basmati.", category: "Main"
  },
  "Veg Biryani": { 
    ingredients: [{ name: "Rice", qty: 0.25 }, { name: "Vegetables", qty: 0.2 }, { name: "Oil", qty: 0.04 }, { name: "Spices", qty: 0.01 }],
    baseCost: 120,
    desc: "Assorted vegetables cooked with aromatic spices.", category: "Veg"
  },
  "Special Chicken Biryani": { 
    ingredients: [{ name: "Rice", qty: 0.25 }, { name: "Chicken", qty: 0.25 }, { name: "Oil", qty: 0.06 }, { name: "Spices", qty: 0.03 }],
    baseCost: 200,
    desc: "Extra spicy chicken biryani with egg.", category: "Special"
  },
  "Parotta & Salna": { 
    ingredients: [{ name: "Maida", qty: 0.15 }, { name: "Oil", qty: 0.05 }, { name: "Spices", qty: 0.02 }], 
    baseCost: 50,
    desc: "Flaky parottas served with spicy chicken/veg salna.", category: "Tiffin"
  },
  "Idli Sambar": { 
    ingredients: [{ name: "Idli Rice", qty: 0.1 }, { name: "Dal", qty: 0.04 }, { name: "Vegetables", qty: 0.05 }],
    baseCost: 30,
    desc: "Steamed fluffy idlis with arachuvitta sambar.", category: "Tiffin"
  },
  "Masala Dosa": { 
    ingredients: [{ name: "Rice", qty: 0.1 }, { name: "Dal", qty: 0.03 }, { name: "Potato", qty: 0.08 }, { name: "Oil", qty: 0.02 }],
    baseCost: 60,
    desc: "Crispy roast dosa with potato masala filling.", category: "Tiffin"
  },
  "Chapati & Kurma": {
    ingredients: [{ name: "Wheat Flour", qty: 0.1 }, { name: "Oil", qty: 0.02 }, { name: "Vegetables", qty: 0.08 }],
    baseCost: 45,
    desc: "Soft chapatis with rich vegetable kurma.", category: "Tiffin"
  },
  "Poori Masala": {
    ingredients: [{ name: "Wheat Flour", qty: 0.1 }, { name: "Oil", qty: 0.08 }, { name: "Potato", qty: 0.1 }],
    baseCost: 50,
    desc: "Puffy pooris served with yellow potato masala.", category: "Tiffin"
  },
  "Pongal Vadai": {
    ingredients: [{ name: "Rice", qty: 0.1 }, { name: "Dal", qty: 0.05 }, { name: "Oil", qty: 0.05 }],
    baseCost: 55,
    desc: "Ghee pongal served with crispy medu vadai.", category: "Tiffin"
  },
  "Veg Meals": {
    ingredients: [{ name: "Rice", qty: 0.3 }, { name: "Dal", qty: 0.05 }, { name: "Vegetables", qty: 0.15 }],
    baseCost: 100,
    desc: "Full course South Indian meals with rice, sambar, etc.", category: "Lunch"
  },
  "Chicken Fried Rice": {
    ingredients: [{ name: "Rice", qty: 0.2 }, { name: "Chicken", qty: 0.1 }, { name: "Vegetables", qty: 0.05 }, { name: "Oil", qty: 0.03 }],
    baseCost: 140,
    desc: "Indo-Chinese style fried rice with chicken chunks.", category: "Chinese"
  },
  "Veg Noodles": {
    ingredients: [{ name: "Noodles", qty: 0.15 }, { name: "Vegetables", qty: 0.1 }, { name: "Oil", qty: 0.03 }],
    baseCost: 110,
    desc: "Hakka noodles tossed with fresh vegetables.", category: "Chinese"
  }
};

const EventPrediction = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState([]);
  
  // Search State for Step 2
  const [searchTerm, setSearchTerm] = useState('');

  const [eventDetails, setEventDetails] = useState({
    guestCount: 500,
    eventType: 'Wedding',
    servingStyle: 'Buffet',
    portionSize: 'Standard'
  });

  const [selectedDishes, setSelectedDishes] = useState([]);
  const [predictionResult, setPredictionResult] = useState(null);
  const [totalCost, setTotalCost] = useState(0);

  // 1. Fetch Inventory & Handle Catalog Redirect
  useEffect(() => {
    axios.get('http://localhost:8080/api/inventory/all')
      .then(res => setInventory(res.data || []))
      .catch(err => console.error(err));

    if (location.state && location.state.selectedDishes) {
      const validDishes = location.state.selectedDishes.filter(d => RECIPE_DB[d]);
      setSelectedDishes(validDishes);
      if (validDishes.length > 0) setStep(2);
    }
  }, [location]);

  // 2. Filter Dishes for Search
  const filteredDishes = Object.keys(RECIPE_DB).filter(dish => 
    dish.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Prediction Logic
  const runPrediction = () => {
    setLoading(true);
    setTimeout(() => {
      let portionFactor = 1.0;
      if (eventDetails.portionSize === 'Small') portionFactor = 0.8;
      if (eventDetails.portionSize === 'Large') portionFactor = 1.2;

      const varietyFactor = selectedDishes.length > 3 ? 0.7 : 1.0; 
      const wastageFactor = 1.05;

      const requirements = {};
      let estimatedCost = 0;

      selectedDishes.forEach(dishName => {
        const recipe = RECIPE_DB[dishName];
        if (recipe) {
          estimatedCost += (recipe.baseCost * eventDetails.guestCount * varietyFactor);
          recipe.ingredients.forEach(ing => {
            const totalNeeded = (ing.qty * eventDetails.guestCount * portionFactor * wastageFactor * varietyFactor);
            if (requirements[ing.name]) requirements[ing.name] += totalNeeded;
            else requirements[ing.name] = totalNeeded;
          });
        }
      });

      const finalAnalysis = Object.keys(requirements).map(ingName => {
        const stockItem = inventory.find(i => i.itemName.toLowerCase().includes(ingName.toLowerCase())) || { currentStock: 0, unit: 'kg' };
        const required = requirements[ingName];
        const deficit = stockItem.currentStock - required;
        const status = deficit >= 0 ? 'Sufficient' : 'Shortage';
        
        return {
          itemName: ingName,
          required: required.toFixed(1),
          current: stockItem.currentStock,
          unit: stockItem.unit,
          status: status,
          cost: (required * 60).toFixed(0)
        };
      });

      setPredictionResult(finalAnalysis);
      setTotalCost(estimatedCost);
      setLoading(false);
      setStep(4); 
    }, 2000);
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFillColor(22, 163, 74);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("AI Event Resource Plan", 14, 20);
    
    doc.setTextColor(0,0,0);
    doc.setFontSize(10);
    doc.text(`Event: ${eventDetails.eventType} (${eventDetails.guestCount} Guests)`, 14, 40);
    doc.text(`Menu: ${selectedDishes.join(', ')}`, 14, 45);

    const tableRows = predictionResult.map(item => [
      item.itemName, `${item.required} ${item.unit}`, `${item.current} ${item.unit}`, item.status
    ]);

    autoTable(doc, {
      head: [["Ingredient", "Required", "In Stock", "Status"]],
      body: tableRows,
      startY: 55,
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74] }
    });

    doc.save("Event_Report.pdf");
  };

  const toggleDish = (dish) => {
    if (selectedDishes.includes(dish)) setSelectedDishes(selectedDishes.filter(d => d !== dish));
    else setSelectedDishes([...selectedDishes, dish]);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 2rem 4rem 2rem' }}>
      
      {/* HEADER PROGRESS */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0, background: 'linear-gradient(to right, #2563eb, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AI Event Brain 🧠
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '1rem' }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ width: '40px', height: '6px', borderRadius: '3px', background: s <= step ? '#2563eb' : '#e2e8f0', transition: 'all 0.3s' }}></div>
          ))}
        </div>
      </div>

      {/* STEP 1: SETUP */}
      {step === 1 && (
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ marginTop: 0 }}>Smart Event Setup</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#64748b' }}>Expected Guests</label>
            <input type="number" value={eventDetails.guestCount} onChange={(e) => setEventDetails({...eventDetails, guestCount: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>
          <button onClick={() => setStep(2)} style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            Next: Select Menu <ArrowRight />
          </button>
        </motion.div>
      )}

      {/* STEP 2: RICH MENU SELECTION (Catalog Style) */}
      {step === 2 && (
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
             <h3>Select Menu Items</h3>
             {/* Search Bar */}
             <div className="glass-card" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '10px', background: 'white', width: '300px' }}>
               <Search size={18} color="#94a3b8" />
               <input type="text" placeholder="Search dish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%' }} />
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {filteredDishes.map(dish => (
              <motion.div 
                key={dish} 
                whileHover={{ y: -5 }}
                onClick={() => toggleDish(dish)}
                className="glass-card"
                style={{ 
                  padding: '1.5rem', cursor: 'pointer', position: 'relative',
                  background: selectedDishes.includes(dish) ? '#eff6ff' : 'white',
                  border: selectedDishes.includes(dish) ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ padding: '10px', background: '#f1f5f9', borderRadius: '50%', marginBottom: '10px' }}>
                    <Utensils size={24} color={selectedDishes.includes(dish) ? "#2563eb" : "#64748b"} />
                  </div>
                  {selectedDishes.includes(dish) && <CheckCircle size={24} color="#2563eb" />}
                </div>
                
                <h3 style={{ margin: '10px 0 5px 0', color: '#1e293b' }}>{dish}</h3>
                <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '10px', background: '#f1f5f9', color: '#64748b' }}>
                  {RECIPE_DB[dish].category}
                </span>
                <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.4' }}>
                  {RECIPE_DB[dish].desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', paddingBottom: '30px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '12px 24px', background: '#cbd5e1', color: '#1e293b', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Back</button>
            <button 
              onClick={runPrediction} 
              disabled={selectedDishes.length === 0} 
              style={{ 
                padding: '12px 30px', 
                background: selectedDishes.length > 0 ? '#16a34a' : '#cbd5e1', 
                color: 'white', border: 'none', borderRadius: '8px', 
                cursor: 'pointer', fontWeight: 'bold' 
              }}
            >
              Run AI Prediction ({selectedDishes.length})
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: LOADING */}
      {step === 3 && (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: 'inline-block' }}>
            <ChefHat size={64} color="#2563eb" />
          </motion.div>
          <h2>Calculating Ingredients...</h2>
        </div>
      )}

      {/* STEP 4: RESULTS */}
      {step === 4 && predictionResult && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          {/* Result Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '5px solid #2563eb' }}>
              <p style={{ margin: 0, color: '#64748b' }}>Est. Cost</p>
              <h2 style={{ fontSize: '2rem', margin: '5px 0' }}>₹{totalCost.toLocaleString()}</h2>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '5px solid #ef4444' }}>
              <p style={{ margin: 0, color: '#64748b' }}>Shortages</p>
              <h2 style={{ fontSize: '2rem', margin: '5px 0', color: '#ef4444' }}>{predictionResult.filter(i => i.status === 'Shortage').length}</h2>
            </div>
          </div>

          <div className="glass-card" style={{ overflowX: 'auto', padding: '1rem', marginBottom: '2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '1rem' }}>Ingredient</th>
                  <th style={{ padding: '1rem' }}>Required</th>
                  <th style={{ padding: '1rem' }}>Current Stock</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {predictionResult.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{item.itemName}</td>
                    <td style={{ padding: '1rem', color: '#2563eb', fontWeight: 'bold' }}>{item.required} {item.unit}</td>
                    <td style={{ padding: '1rem' }}>{item.current} {item.unit}</td>
                    <td style={{ padding: '1rem' }}><span className={`badge ${item.status === 'Shortage' ? 'badge-low' : 'badge-good'}`}>{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
             <button onClick={() => setStep(1)} style={{ padding: '12px 24px', background: '#cbd5e1', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Start New</button>
             <button onClick={downloadReport} style={{ padding: '12px 24px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display:'flex', gap:'8px' }}><Download size={18}/> Download PDF</button>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
};

export default EventPrediction;