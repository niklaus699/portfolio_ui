import { motion } from 'framer-motion';
import type { Project } from '../types';
import { ExternalLink, FolderGit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group relative overflow-hidden rounded-3xl glass h-full flex flex-col"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/60" />
        
        {/* Tech badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {project.tech_stack.slice(0, 3).map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs font-mono bg-black/60 text-white/90 rounded-2xl backdrop-blur-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-heading tracking-tight mb-3 group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        
        <p className="text-slate-400 line-clamp-3 text-sm flex-1">
          {project.description.substring(0, 140)}...
        </p>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-3">
            {project.live_link && (
              <a
                href={project.live_link}
                target="_blank"
                className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-accent hover:text-cyan-300"
              >
                <ExternalLink className="w-3 h-3" /> Live
              </a>
            )}
            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-slate-400 hover:text-white"
              >
                <FolderGit2 className="w-3 h-3" /> Code
              </a>
            )}
          </div>
          
          <Link
            to={`/project/${project.slug}`}
            className="text-xs font-medium px-5 py-2.5 rounded-2xl border border-slate-600 hover:border-accent hover:text-accent transition-colors"
          >
            Details →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
