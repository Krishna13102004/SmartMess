import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ChefHat, Database, Calculator, IndianRupee, 
  AlertTriangle, CheckCircle2, FileText, BrainCircuit, 
  Clock, TrendingDown, GitCommit, ShieldCheck, ShoppingCart,
  ChevronDown, Instagram, Twitter, Facebook, Linkedin, Zap, Smartphone
} from 'lucide-react';

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [guestCount, setGuestCount] = useState(250);
  const [wastageKgs, setWastageKgs] = useState(15);
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  // Bootstrap Native Dark Mode Trigger
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // --- Flexible Theme Colors ---
  const heroBgColor = darkMode ? '#121212' : '#eafaf1'; 
  const sectionBgWhite = darkMode ? '#1e1e1e' : '#ffffff'; 
  const sectionBgGray = darkMode ? '#121212' : '#f8f9fa';

  // --- Smooth Scroll Function 🔥 ---
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Offset for sticky navbar height (approx 80px)
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // --- Animation Variants ---
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { q: "How does the AI Event Predictor work?", a: "It uses your pre-defined recipe-yield ratios and multiplies them with the guest count, adding a smart buffer to generate an exact raw material shopping list." },
    { q: "Can kitchen staff use this on their mobile phones?", a: "Yes! The Staff Portal is 100% mobile-responsive, allowing kitchen workers to log daily usage directly from their phones." },
    { q: "What happens when an item's stock goes too low?", a: "The system automatically detects low stock based on your threshold limits and triggers an Auto-Purchase Order (PO) to your registered vendors." },
    { q: "Is my data secure?", a: "Absolutely. We use industry-standard encryption and role-based access control so kitchen staff can only log data, while admins control the finances." }
  ];

  return (
    <div className="d-flex flex-column min-vh-100 font-sans overflow-hidden">
      
      {/* --- HEADER --- */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        className="navbar navbar-expand-lg px-4 py-3 shadow-sm sticky-top" style={{ backgroundColor: sectionBgWhite, zIndex: 1000 }}
      >
        <div className="container">
          <div className="d-flex align-items-center gap-2" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} style={{cursor: 'pointer'}}>
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }} className="bg-success rounded p-1 d-flex align-items-center justify-content-center">
               <ChefHat size={28} className="text-white" />
            </motion.div>
            <h3 className="mb-0 fw-bold text-success" style={{ letterSpacing: '1px' }}>SMART MESS</h3>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <div className="d-none d-md-flex gap-4 fw-semibold text-secondary me-3">
              <span onClick={() => scrollToSection('features')} className="cursor-pointer hover-success transition">Features</span>
              <span onClick={() => scrollToSection('workflow')} className="cursor-pointer hover-success transition">Workflow</span>
              <span onClick={() => scrollToSection('faqs')} className="cursor-pointer hover-success transition">FAQs</span>
            </div>
            {/* UPDATED: Navigates to /login */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/login')} 
              className="btn btn-success fw-bold px-4 d-none d-md-block shadow-sm">
              Login
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* --- HERO SECTION --- */}
      <section className="py-5 position-relative" style={{ backgroundColor: heroBgColor, transition: 'background-color 0.3s ease' }}>
        <motion.div animate={{ y: ["-15px", "15px"] }} transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} 
          className="position-absolute top-0 start-0 m-5 p-4 bg-success rounded-circle opacity-10" style={{ width: '200px', height: '200px', filter: 'blur(50px)' }} />
        
        <div className="container py-5 position-relative z-index-1">
          <div className="row align-items-center justify-content-between g-5">
            <div className="col-lg-6">
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <motion.div variants={fadeUp} className="badge bg-success bg-opacity-10 text-success px-3 py-2 mb-3 rounded-pill fw-bold border border-success">
                  🚀 v2.0 - AI Powered ERP
                </motion.div>
                <motion.h1 variants={fadeUp} className="display-4 fw-bolder mb-4" style={{ color: darkMode ? '#fff' : '#1a1a1a' }}>
                  Stop Guessing. <br />
                  <span className="text-success">Start Predicting.</span>
                </motion.h1>
                <motion.p variants={fadeUp} className="lead mb-5" style={{ color: darkMode ? '#ccc' : '#555' }}>
                  The ultimate AI-powered ERP for modern hostel messes. Eliminate food wastage, automate procurement, and achieve 100% inventory accuracy.
                </motion.p>
                <motion.div variants={fadeUp} className="d-flex flex-wrap gap-3">
                  {/* UPDATED: Navigates to /login */}
                  <motion.button whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(25, 135, 84, 0.3)" }} onClick={() => navigate('/login')} 
                    className="btn btn-success btn-lg d-flex align-items-center gap-2 px-4 py-3 fw-bold">
                    Explore Dashboard <ArrowRight size={20} />
                  </motion.button>
                  {/* UPDATED: Navigates to /login */}
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/login')} 
                    className={`btn btn-lg d-flex align-items-center gap-2 px-4 py-3 fw-bold ${darkMode ? 'btn-light text-dark' : 'bg-white border text-dark shadow-sm'}`}>
                    <Database size={20} /> Staff Portal
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>

            <div className="col-lg-5">
              <motion.div initial={{ opacity: 0, scale: 0.8, rotateY: 15 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                className={`card shadow-lg border-0 rounded-4 p-4 ${darkMode ? 'bg-dark border-secondary' : 'bg-white'}`} style={{ backdropFilter: 'blur(10px)' }}>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="p-3 bg-success bg-opacity-10 rounded-circle">
                    <Calculator size={28} className="text-success" />
                  </div>
                  <h4 className="mb-0 fw-bold">Live AI Predictor</h4>
                </div>
                <div className="mb-4">
                  <label className="d-flex justify-content-between fw-bold mb-3 fs-6">
                    <span className="text-muted">Expected Headcount</span>
                    <motion.span key={guestCount} initial={{ scale: 1.5, color: '#198754' }} animate={{ scale: 1 }} className="text-success fw-bolder">{guestCount} Pax</motion.span>
                  </label>
                  <input type="range" className="form-range" min="50" max="1500" step="50" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} />
                </div>
                <div className={`p-4 rounded-3 border ${darkMode ? 'bg-black bg-opacity-25 border-secondary' : 'bg-light border-light'}`}>
                  <ul className="list-unstyled mb-0 fs-6">
                    <li className="d-flex justify-content-between align-items-center mb-3"><span>🍚 Basmati Rice</span> <span className="fw-bolder text-success">{(guestCount * 0.15).toFixed(1)} kg</span></li>
                    <li className="d-flex justify-content-between align-items-center mb-3"><span>🍗 Fresh Chicken</span> <span className="fw-bolder text-danger">{(guestCount * 0.2).toFixed(1)} kg</span></li>
                    <li className="d-flex justify-content-between align-items-center"><span>🛢️ Cooking Oil</span> <span className="fw-bolder text-warning">{(guestCount * 0.03).toFixed(1)} Ltrs</span></li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section id="features" className="py-5" style={{ backgroundColor: sectionBgWhite }}>
        <div className="container py-5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-5">
            <h2 className="fw-bold mb-3">Why Choose Smart-Mess?</h2>
            <p className="text-muted max-w-2xl mx-auto">Our platform brings digital transformation to traditional hostel kitchens.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="row g-4">
            {[
              { icon: <Zap size={32} />, title: "Real-Time Tracking", desc: "Monitor your inventory levels instantly with digital daily logs.", color: "text-warning", bg: "bg-warning" },
              { icon: <TrendingDown size={32} />, title: "Zero Wastage", desc: "AI algorithms ensure you only purchase exactly what you need.", color: "text-success", bg: "bg-success" },
              { icon: <ShieldCheck size={32} />, title: "Prevent Pilferage", desc: "100% accountability for every gram of ingredient used.", color: "text-primary", bg: "bg-primary" },
              { icon: <Smartphone size={32} />, title: "Mobile Friendly", desc: "Staff can easily log entries from any mobile device or tablet.", color: "text-info", bg: "bg-info" }
            ].map((feature, idx) => (
              <motion.div variants={fadeUp} className="col-md-6 col-lg-3" key={idx}>
                <motion.div whileHover={{ y: -10, boxShadow: "0px 10px 20px rgba(0,0,0,0.08)" }} 
                  className={`card h-100 border-0 shadow-sm p-4 text-center cursor-pointer ${darkMode ? 'bg-dark' : 'bg-white border'}`}>
                  <div className={`mb-3 d-inline-block p-3 rounded-circle ${feature.bg} bg-opacity-10 ${feature.color}`}>{feature.icon}</div>
                  <h5 className="fw-bold">{feature.title}</h5>
                  <p className="text-muted small mb-0">{feature.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- EXISTING VS PROPOSED --- */}
      <section className="py-5" style={{ backgroundColor: sectionBgGray }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Why Change?</h2>
            <p className="text-muted max-w-2xl mx-auto">Moving from outdated manual processes to intelligent automation.</p>
          </div>
          <div className="row g-4 align-items-stretch">
            <div className="col-md-6">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="card h-100 border-0 rounded-4 p-4 p-lg-5 shadow-sm" style={{ backgroundColor: darkMode ? '#2a1215' : '#fff5f5', borderTop: '4px solid #ff5252' }}>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="p-3 rounded-circle bg-danger bg-opacity-10">
                    <AlertTriangle size={32} className="text-danger" />
                  </div>
                  <h3 className="fw-bold mb-0 text-danger">Existing System</h3>
                </div>
                <ul className="list-unstyled d-flex flex-column gap-4 mt-4 text-muted">
                  <li className="d-flex gap-3"><FileText size={24} className="text-danger flex-shrink-0" /><span>Paper-based stock registers leading to manual calculation errors.</span></li>
                  <li className="d-flex gap-3"><TrendingDown size={24} className="text-danger flex-shrink-0" /><span>High food wastage due to inaccurate guesswork for daily cooking.</span></li>
                  <li className="d-flex gap-3"><Clock size={24} className="text-danger flex-shrink-0" /><span>Delayed purchase orders causing sudden raw material stockouts.</span></li>
                </ul>
              </motion.div>
            </div>
            <div className="col-md-6">
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="card h-100 border-0 rounded-4 p-4 p-lg-5 shadow-lg" style={{ backgroundColor: darkMode ? '#122a1c' : '#f0fdf4', borderTop: '4px solid #198754' }}>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="p-3 rounded-circle bg-success bg-opacity-10">
                    <BrainCircuit size={32} className="text-success" />
                  </div>
                  <h3 className="fw-bold mb-0 text-success">Proposed Smart-Mess</h3>
                </div>
                <ul className="list-unstyled d-flex flex-column gap-4 mt-4" style={{ color: darkMode ? '#ccc' : '#1a1a1a' }}>
                  <li className="d-flex gap-3"><Database size={24} className="text-success flex-shrink-0" /><span>Cloud-based real-time inventory tracking with recipe-yield deduction.</span></li>
                  <li className="d-flex gap-3"><CheckCircle2 size={24} className="text-success flex-shrink-0" /><span>AI Event Predictor estimates exact raw materials, achieving zero wastage.</span></li>
                  <li className="d-flex gap-3"><ShoppingCart size={24} className="text-success flex-shrink-0" /><span>Auto-PO Generation instantly triggers requests to vendors when stock is low.</span></li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ROI CALCULATOR --- */}
      <section className="py-5" style={{ backgroundColor: sectionBgWhite }}>
        <div className="container py-5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} className="row align-items-center g-5">
            <div className="col-lg-6 text-center text-lg-start">
              <h2 className="fw-bold mb-3">See Your Monthly Savings</h2>
              <p className="text-muted mb-4">Hostels waste an average of 15% of food due to poor manual estimation. Adjust the slider to see how much Smart-Mess saves you monthly!</p>
            </div>
            <div className="col-lg-6">
              <motion.div whileHover={{ y: -5 }} className={`card shadow-sm border rounded-4 p-4 ${darkMode ? 'bg-dark border-secondary' : 'bg-white border-light'}`}>
                <label className="d-flex justify-content-between fw-bold mb-3">
                  <span className="text-muted">Daily Food Wastage Reduced</span>
                  <span className="text-danger fw-bolder">{wastageKgs} kg</span>
                </label>
                <input type="range" className="form-range mb-4" min="5" max="50" step="1" value={wastageKgs} onChange={(e) => setWastageKgs(e.target.value)} />
                <div className="bg-success bg-opacity-10 p-4 rounded-4 text-center border border-success border-opacity-25">
                  <p className="mb-1 fw-bold text-success text-uppercase tracking-widest small">Estimated Monthly Savings</p>
                  <motion.h2 key={wastageKgs} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="display-5 fw-extrabold text-success mb-0 d-flex align-items-center justify-content-center gap-1">
                    <IndianRupee size={36} /> {(wastageKgs * 65 * 30).toLocaleString('en-IN')}
                  </motion.h2>
                  <small className="text-muted mt-2 d-block">*Calculated at avg ₹65/kg over 30 days.</small>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- WORKFLOW --- */}
      <section id="workflow" className="py-5 position-relative" style={{ backgroundColor: heroBgColor }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">System Workflow</h2>
            <p className="text-muted">The 4-step automated journey of your kitchen.</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="position-relative ms-3 ms-md-5">
                <div className="position-absolute top-0 bottom-0 bg-success bg-opacity-25" style={{ left: '15px', width: '3px' }}></div>
                {[
                  { title: "Master Data Initialization", desc: "Admin updates initial stock levels, vendor details, and recipe yield formulas.", icon: <Database size={18} /> },
                  { title: "AI Demand Forecasting", desc: "Before cooking, AI calculates exact ingredient quantities based on the headcount.", icon: <BrainCircuit size={18} /> },
                  { title: "Live Kitchen Logging", desc: "Staff executes cooking and logs the usage; system auto-deducts from main inventory.", icon: <GitCommit size={18} /> },
                  { title: "Smart Procurement Alerts", desc: "If any item drops below the threshold, an Auto-Purchase Order (PO) is generated.", icon: <ShieldCheck size={18} /> }
                ].map((step, idx) => (
                  <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} className="position-relative mb-5 ps-5" key={idx}>
                    <div className="position-absolute d-flex justify-content-center align-items-center rounded-circle shadow bg-success text-white" style={{ width: '32px', height: '32px', left: '0', top: '0', zIndex: 2 }}>
                      {step.icon}
                    </div>
                    <div className={`card border-0 shadow-sm rounded-4 p-4 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
                      <h5 className="fw-bold mb-2">{step.title}</h5>
                      <p className="mb-0 small text-muted">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQS --- */}
      <section id="faqs" className="py-5" style={{ backgroundColor: sectionBgWhite }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">Got questions?</h2>
            <p className="text-muted">Everything you need to know about the product.</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="d-flex flex-column gap-3">
                {faqs.map((faq, index) => (
                  <div key={index} className={`card border rounded-4 overflow-hidden ${darkMode ? 'bg-dark border-secondary' : 'bg-white border-light shadow-sm'}`}>
                    <button onClick={() => toggleFaq(index)} className="w-100 text-start d-flex justify-content-between align-items-center p-4 bg-transparent border-0" style={{ color: darkMode ? '#fff' : '#1a1a1a', cursor: 'pointer' }}>
                      <h6 className="mb-0 fw-bold fs-5">{faq.q}</h6>
                      <motion.div animate={{ rotate: openFaq === index ? 180 : 0 }}>
                        <ChevronDown size={24} className={openFaq === index ? "text-success" : "text-muted"} />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                          <div className="px-4 pb-4 pt-1 text-muted">{faq.a}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="pt-5 mt-auto" style={{ backgroundColor: darkMode ? '#0a0a0a' : '#111827', color: '#e5e7eb' }}>
        <div className="container pb-5">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
              <div className="d-flex align-items-center gap-2 mb-4">
                <ChefHat size={32} className="text-success" />
                <h3 className="mb-0 fw-bold text-white">Smart-Mess</h3>
              </div>
              <p className="small text-secondary pe-lg-4">
                Revolutionizing hostel kitchens with AI. Designed exclusively for Indra Ganesan College of Engineering.
              </p>
            </div>
            <div className="col-lg-2 col-md-3 col-6">
              <h6 className="fw-bold mb-4 text-uppercase text-secondary" style={{ letterSpacing: '1px', fontSize: '13px' }}>Company</h6>
              <ul className="list-unstyled d-flex flex-column gap-3 small">
                <li><span className="footer-link cursor-pointer">About Us</span></li>
                <li><span className="footer-link cursor-pointer">College Dept</span></li>
                <li><span className="footer-link cursor-pointer">Project Members</span></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-3 col-6">
              <h6 className="fw-bold mb-4 text-uppercase text-secondary" style={{ letterSpacing: '1px', fontSize: '13px' }}>Modules</h6>
              <ul className="list-unstyled d-flex flex-column gap-3 small">
                <li><span className="footer-link cursor-pointer">Inventory Master</span></li>
                <li><span className="footer-link cursor-pointer">AI Event Predictor</span></li>
                <li><span className="footer-link cursor-pointer">Staff Logging</span></li>
                <li><span className="footer-link cursor-pointer">Auto-PO System</span></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-3 col-6 mt-4 mt-md-0">
              <h6 className="fw-bold mb-4 text-uppercase text-secondary" style={{ letterSpacing: '1px', fontSize: '13px' }}>Links</h6>
              <ul className="list-unstyled d-flex flex-column gap-3 small">
                {/* UPDATED: Navigates to /login */}
                <li><span onClick={() => navigate('/login')} className="footer-link cursor-pointer text-success fw-bold">Admin Login</span></li>
                {/* UPDATED: Navigates to /login */}
                <li><span onClick={() => navigate('/login')} className="footer-link cursor-pointer">Staff Portal</span></li>
                <li><span className="footer-link cursor-pointer">Documentation</span></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-3 col-12 mt-4 mt-lg-0 d-flex justify-content-lg-end">
              <div className="d-flex gap-3">
                <div className="social-icon"><Instagram size={18} /></div>
                <div className="social-icon"><Twitter size={18} /></div>
                <div className="social-icon"><Facebook size={18} /></div>
                <div className="social-icon"><Linkedin size={18} /></div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-4 border-top border-secondary border-opacity-25" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
            <ul className="list-inline mb-0 small text-secondary">
              <li className="list-inline-item me-4 footer-link cursor-pointer">Legal</li>
              <li className="list-inline-item me-4 footer-link cursor-pointer">Privacy Center</li>
              <li className="list-inline-item me-4 footer-link cursor-pointer">Privacy Policy</li>
              <li className="list-inline-item footer-link cursor-pointer">Cookies</li>
            </ul>
            <p className="mb-0 small mt-3 mt-md-0 text-secondary">
              &copy; 2026 Smart-Mess ERP India.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        .hover-success:hover { color: #198754 !important; }
        .transition { transition: all 0.3s ease; }
        .cursor-pointer { cursor: pointer; }
        .footer-link {
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: #198754; 
        }
        .social-icon {
          width: 40px;
          height: 40px;
          background-color: rgba(255,255,255,0.05);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s;
        }
        .social-icon:hover {
          background-color: #198754;
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;