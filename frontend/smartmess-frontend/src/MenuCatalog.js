import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, ArrowRight, Utensils, Coffee } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// 🍽️ FOOD MENU (Dishes mapped to DB Ingredients in Backend)
const MENU_ITEMS = [
  // --- INDIAN SPECIALS ---
  { id: 1, name: "Chicken Biryani", category: "Main Course", image: "https://source.unsplash.com/500x400/?biryani", desc: "Aromatic basmati rice with tender chicken" },
  { id: 2, name: "Mutton Biryani", category: "Main Course", image: "https://source.unsplash.com/500x400/?mutton,biryani", desc: "Spicy seeraga samba mutton biryani" },
  { id: 3, name: "Parotta & Salna", category: "Main Course", image: "https://source.unsplash.com/500x400/?paratha,curry", desc: "Flaky parotta with spicy chicken salna" },
  { id: 4, name: "Veg Meals", category: "Main Course", image: "https://source.unsplash.com/500x400/?thali", desc: "Full meals with Rice, Sambar, Rasam, Poriyal" },
  { id: 5, name: "Chapati & Kurma", category: "Dinner", image: "https://source.unsplash.com/500x400/?chapati", desc: "Soft chapatis with mixed vegetable kurma" },
  { id: 6, name: "Idli Sambar", category: "Breakfast", image: "https://source.unsplash.com/500x400/?idli", desc: "Steaming hot idlis with lentil stew" },
  { id: 7, name: "Masala Dosa", category: "Breakfast", image: "https://source.unsplash.com/500x400/?dosa", desc: "Crispy crepe with potato masala filling" },
  { id: 8, name: "Pongal Vadai", category: "Breakfast", image: "https://source.unsplash.com/500x400/?pongal", desc: "Ghee pongal with crispy medu vadai" },
  { id: 9, name: "Poori Masala", category: "Breakfast", image: "https://source.unsplash.com/500x400/?poori", desc: "Puffy bread with potato curry" },

  // --- INTERNATIONAL & CHINESE ---
  { id: 10, name: "Chicken Fried Rice", category: "Main Course", image: "https://source.unsplash.com/500x400/?friedrice", desc: "Indo-Chinese style stir-fried rice" },
  { id: 11, name: "Veg Noodles", category: "Main Course", image: "https://source.unsplash.com/500x400/?noodles", desc: "Hakka noodles with crunchy veggies" },
  { id: 12, name: "Chicken Pasta", category: "International", image: "https://source.unsplash.com/500x400/?pasta", desc: "Creamy white sauce pasta with herbs" },
  { id: 13, name: "Grilled Chicken", category: "International", image: "https://source.unsplash.com/500x400/?grilledchicken", desc: "Healthy grilled chicken with boiled veggies" },
  { id: 14, name: "Club Sandwich", category: "Snacks", image: "https://source.unsplash.com/500x400/?sandwich", desc: "Triple-layer sandwich with cheese and veggies" },
  { id: 15, name: "French Fries", category: "Snacks", image: "https://source.unsplash.com/500x400/?fries", desc: "Crispy salted fries with ketchup" },
  { id: 16, name: "Chicken Burger", category: "Snacks", image: "https://source.unsplash.com/500x400/?burger", desc: "Juicy chicken patty burger with cheese" },

  // --- BEVERAGES ---
  { id: 17, name: "Filter Coffee", category: "Beverages", image: "https://source.unsplash.com/500x400/?coffee", desc: "Traditional South Indian filter coffee" },
  { id: 18, name: "Masala Chai", category: "Beverages", image: "https://source.unsplash.com/500x400/?chai", desc: "Spiced tea with cardamom and ginger" },
  { id: 19, name: "Fresh Juice", category: "Beverages", image: "https://source.unsplash.com/500x400/?juice", desc: "Seasonal fresh fruit juice" },
];

const MenuCatalog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSelectionMode = location.state?.from === 'prediction';

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  // Filter Logic
  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["All", "Breakfast", "Main Course", "Dinner", "International", "Snacks", "Beverages"];

  const toggleSelection = (item) => {
    if (!isSelectionMode) return alert(`Item: ${item.name}\nDescription: ${item.desc}`);
    
    if (selectedItems.includes(item.name)) {
      setSelectedItems(selectedItems.filter(i => i !== item.name));
    } else {
      setSelectedItems([...selectedItems, item.name]);
    }
  };

  const confirmSelection = () => {
    navigate('/event-prediction', { state: { selectedDishes: selectedItems } });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem 100px 1rem' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '3rem', margin: 0, background: 'linear-gradient(to right, #f59e0b, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {isSelectionMode ? "Select Food Menu" : "International Menu"}
        </h1>
        <p style={{ color: '#94a3b8' }}>Select dishes to calculate required database ingredients</p>
      </div>

      {/* FILTERS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '15px 25px', gap: '15px', maxWidth: '600px', margin: '0 auto', width: '100%', borderRadius: '50px', background: 'rgba(255,255,255,0.08)' }}>
          <Search size={22} color="#94a3b8" />
          <input type="text" placeholder="Search for Biryani, Parotta, Pasta..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '1.1rem' }} />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '8px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: activeCategory === cat ? 'white' : 'rgba(255,255,255,0.1)', color: activeCategory === cat ? 'black' : '#94a3b8' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FOOD GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {filteredItems.map((item) => {
          const isSelected = selectedItems.includes(item.name);
          return (
            <motion.div 
              key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-card"
              style={{ 
                overflow: 'hidden', border: isSelected ? '2px solid #4ade80' : '1px solid rgba(255,255,255,0.1)',
                background: isSelected ? 'rgba(74, 222, 128, 0.05)' : '#1e293b', position: 'relative', cursor: 'pointer'
              }}
              onClick={() => toggleSelection(item)}
            >
              {isSelected && <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, background: '#4ade80', borderRadius: '50%', padding: '5px' }}><CheckCircle size={20} color="black"/></div>}
              
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '180px', objectFit: 'cover', opacity: isSelected ? 0.8 : 1 }} />
              
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{item.name}</h3>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{item.category}</span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '10px' }}>{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CONFIRM BUTTON */}
      <AnimatePresence>
        {selectedItems.length > 0 && isSelectionMode && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            style={{ 
              position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', 
              background: '#4ade80', padding: '15px 30px', borderRadius: '50px', 
              display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 10px 30px rgba(74, 222, 128, 0.4)',
              cursor: 'pointer', zIndex: 100
            }}
            onClick={confirmSelection}
          >
            <span style={{ color: 'black', fontWeight: 'bold', fontSize: '1.1rem' }}>{selectedItems.length} Dishes Selected</span>
            <div style={{ background: 'black', borderRadius: '50%', padding: '8px', display: 'flex' }}><ArrowRight color="white" size={20} /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MenuCatalog;