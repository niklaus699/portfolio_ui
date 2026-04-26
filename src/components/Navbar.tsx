import { motion } from 'framer-motion';
import { Plus, LogIn, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../api';

interface Props {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  onAddClick: () => void;
}

export default function Navbar({ isAdmin, setIsAdmin, onAddClick }: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthToken(null);
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-700/30"
    >
      <div className="max-w-screen-2xl mx-auto px-8 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-3xl font-heading tracking-tighter">Nicks Realm</span>
          <span className="text-accent text-2xl">◉</span>
        </Link>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {isAdmin && (
          <button
            onClick={onAddClick}   // ← receive this prop from App
            className="flex items-center gap-2 px-4 py-4 md:px-6 md:py-3 rounded-2xl bg-accent text-black font-medium hover:bg-cyan-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
          )}

          {!isAdmin ? (
            <Link
              to="/admin/login"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <LogIn className="w-5 h-5" />
              <span className="font-medium">Admin</span>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}