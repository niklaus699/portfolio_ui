import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '../api';
import ProjectCard from '../components/ProjectCard';
import type { Project } from '../types';
import { RefreshCw, Loader2 } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const skeletonContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

interface Props {
  isAdmin: boolean;
  refreshKey: number;
}

export default function Gallery({ isAdmin, refreshKey }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/projects/');
      const projectList = res.data.results || res.data;
      setProjects(Array.isArray(projectList) ? projectList : []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch projects', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [refreshKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchProjects();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const SkeletonCard = () => (
    <motion.div
      variants={container}
      className="glass rounded-3xl overflow-hidden h-full flex flex-col"
    >
      <div className="aspect-video bg-slate-800 animate-pulse" />
      <div className="p-6 flex-1 flex flex-col">
        <div className="h-7 bg-slate-700 rounded-2xl w-3/4 animate-pulse mb-4" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-700 rounded-2xl animate-pulse" />
          <div className="h-4 bg-slate-700 rounded-2xl w-5/6 animate-pulse" />
          <div className="h-4 bg-slate-700 rounded-2xl w-2/3 animate-pulse" />
        </div>
        <div className="mt-6 flex justify-between items-center">
          <div className="h-8 bg-slate-700 rounded-3xl w-24 animate-pulse" />
          <div className="h-8 bg-slate-700 rounded-3xl w-28 animate-pulse" />
        </div>
      </div>
    </motion.div>
  );

  if (loading && projects.length === 0) {
    return (
      <div className="pt-24 pb-20 max-w-screen-2xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-heading tracking-tighter leading-none flex items-center gap-4">
            Selected Works
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </h1>
          <p className="text-xl text-slate-400 mt-4">Crafting the gallery...</p>
        </motion.div>

        <motion.div
          variants={skeletonContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-screen-2xl mx-auto px-6 md:px-8">
      {/* RESPONSIVE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12">
          {/* Title + Subtitle */}
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-heading tracking-tighter leading-none">
              Nicks Projects
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mt-4">
              A curated collection of my digital experiences and products.
            </p>
          </div>

          {/* Controls - stacked on mobile, right-aligned on desktop */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 lg:justify-end">
            <button
              onClick={fetchProjects}
              className="flex items-center gap-2 px-5 py-3 glass rounded-3xl text-sm font-medium hover:text-accent transition-colors w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <p className="text-xs text-slate-500 whitespace-nowrap">
              Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* PROJECT GRID */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>

      {projects.length === 0 && (
        <p className="text-center text-slate-400 mt-20 text-lg">
          No projects yet. Add some in Django Admin!
        </p>
      )}

      {isAdmin && (
        <div className="mt-16 text-center text-xs text-slate-500">
          Admin mode active • New projects appear within 15 seconds or click Refresh
        </div>
      )}
    </div>
  );
}