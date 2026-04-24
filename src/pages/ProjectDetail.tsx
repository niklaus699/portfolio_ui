import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as Lucide from 'lucide-react';
import { ArrowLeft, ExternalLink, FolderGit2 } from 'lucide-react';
import api from '../api';
import type { Project } from '../types';

const FeatureBadge = ({ feature }: { feature: any }) => {
  const IconComponent = feature.icon
    ? (Lucide[feature.icon as keyof typeof Lucide] as React.ComponentType<any> | undefined)
    : undefined;

  const variantStyles: Record<string, string> = {
    accent: 'bg-accent/10 text-accent border-accent/30 hover:border-accent/50',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/50',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:border-amber-500/50',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:border-blue-500/50',
  };

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-3xl border text-sm font-medium transition-all ${variantStyles[feature.variant]}`}
    >
      {IconComponent && <IconComponent className="w-4 h-4" />}
      <span className="font-medium">{feature.label}</span>
    </motion.div>
  );
};

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    api.get(`/api/projects/?slug=${slug}`)
      .then((res) => {
        const results = res.data.results || res.data;
        setProject(Array.isArray(results) ? results[0] : null);
      })
      .catch(() => setProject(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-mono">LOADING PROJECT...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-4xl font-heading tracking-tighter mb-3">Project not found</h2>
          <Link to="/" className="text-accent hover:underline">← Back to Nicks Realm</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-24 pb-20 max-w-screen-2xl mx-auto px-6 md:px-8"
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Nicks Realm
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <div className="glass rounded-3xl p-8 md:p-12">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full rounded-2xl aspect-video object-cover mb-10"
            />

            <div className="mb-10">
              <h1 className="text-5xl md:text-6xl font-heading tracking-tighter leading-none mb-6">
                {project.title}
              </h1>

              {project.features && project.features.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {project.features.map((feature: any) => (
                    <FeatureBadge key={feature.label} feature={feature} />
                  ))}
                </div>
              )}
            </div>

            {/* Sweet, Spacious Description */}
            <div className="prose prose-invert prose-lg max-w-none 
                          prose-headings:font-heading prose-headings:tracking-tighter
                          prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-8
                          prose-li:text-slate-300 prose-li:leading-relaxed
                          prose-strong:text-white
                          prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.description}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass rounded-3xl p-8">
            <h3 className="uppercase text-xs tracking-[2px] font-mono text-slate-400 mb-6">Project Links</h3>
            
            {project.live_link && (
              <a
                href={project.live_link}
                target="_blank"
                className="flex items-center justify-between py-6 border-b border-surface-border hover:text-accent group"
              >
                <span className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5" />
                  Live Website
                </span>
                <span className="text-xs uppercase font-medium">Visit →</span>
              </a>
            )}

            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                className="flex items-center justify-between py-6 border-b border-surface-border hover:text-accent group"
              >
                <span className="flex items-center gap-3">
                  <FolderGit2 className="w-5 h-5" />
                  GitHub Repository
                </span>
                <span className="text-xs uppercase font-medium">View Code →</span>
              </a>
            )}
          </div>

          <div className="glass rounded-3xl p-8">
            <h3 className="uppercase text-xs tracking-[2px] font-mono text-slate-400 mb-6">Project Details</h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-mono text-slate-400">TECH STACK</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.tech_stack.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-4 py-1 text-xs font-mono bg-surface-base border border-surface-border rounded-3xl"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-surface-border">
                <p className="text-xs font-mono text-slate-400">PUBLISHED</p>
                <p className="font-medium mt-1">
                  {new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}