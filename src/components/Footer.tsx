import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass border-t border-slate-700/30 py-12 mt-24"
    >
      <div className="max-w-screen-2xl mx-auto px-8 text-center">
        <p className="text-slate-400 text-sm">
          © {new Date().getFullYear()} Nicks Realm • Crafted with precision
        </p>
        <p className="text-xs text-slate-500 mt-2">Built with Django + React + Tailwind</p>
      </div>
    </motion.footer>
  );
}