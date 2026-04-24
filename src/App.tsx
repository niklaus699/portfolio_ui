import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Gallery from './pages/Gallery';
import ProjectDetail from './pages/ProjectDetail';
import AdminLogin from './components/AdminLogin';
import Footer from './components/Footer';
import AddProjectModal from './components/AddProjectModal';
import { useEffect, useState } from 'react';

function App() {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('adminToken'));
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);   // ← Triggers gallery refresh

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAdmin(!!token);
  }, []);

  const handleProjectAdded = () => {
    setRefreshKey(prev => prev + 1);   // Forces Gallery to refetch
  };

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar 
          isAdmin={isAdmin} 
          setIsAdmin={setIsAdmin} 
          onAddClick={() => setShowAddModal(true)} 
        />
        
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={<Gallery isAdmin={isAdmin} refreshKey={refreshKey} />} 
            />
            <Route path="/project/:slug" element={<ProjectDetail />} />
            <Route path="/admin/login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
          </Routes>
        </AnimatePresence>

        <AddProjectModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onProjectAdded={handleProjectAdded}
        />
      </div>
      <Footer />
    </Router>
  );
}

export default App;