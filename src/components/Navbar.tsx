import { motion } from 'framer-motion';
import { Plus, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  isAdmin: boolean;
  onAddClick: () => void;
}

export default function Navbar({ isAdmin, onAddClick }: Props) {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-700/30"
    >
      <div className="max-w-screen-2xl mx-auto px-6 md:px-8 py-5 flex justify-between items-center">
        
        {/* Tighter Logo */}
        <Link to="/" className="flex items-center gap-1 md:gap-2">
          <span className="text-3xl font-heading tracking-tighter">Nicks Realm</span>
          <span className="text-accent text-2xl">◉</span>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {isAdmin && (
            <button
              onClick={onAddClick}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-accent text-black font-medium hover:bg-cyan-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Project</span>
            </button>
          )}

          {!isAdmin && (
            <Link
              to="/admin/login"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <LogIn className="w-5 h-5" />
              <span className="font-medium">Admin</span>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}