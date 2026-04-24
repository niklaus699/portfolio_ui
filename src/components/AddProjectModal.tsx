import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle, Plus, Trash2 } from 'lucide-react';
import api from '../api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: () => void;
}

interface Feature {
  label: string;
  icon: string;
  variant: 'accent' | 'success' | 'warning' | 'info';
}

export default function AddProjectModal({ isOpen, onClose, onProjectAdded }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    live_link: '',
    github_link: '',
    tech_stack: '',
    featured: false,
    order: 0,
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const addFeature = () => {
    setFeatures([...features, { label: '', icon: '', variant: 'accent' }]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (formData.live_link) data.append('live_link', formData.live_link);
    if (formData.github_link) data.append('github_link', formData.github_link);
    data.append('featured', String(formData.featured));
    data.append('order', String(formData.order));

    const techArray = formData.tech_stack.split(',').map(t => t.trim()).filter(Boolean);
    data.append('tech_stack', JSON.stringify(techArray));

    if (thumbnail) data.append('thumbnail', thumbnail);

    try {
      // 1. Create the project
      const projectRes = await api.post('/api/projects/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newProject = projectRes.data;

      // 2. Create features (if any were added)
      if (features.length > 0) {
        for (const feature of features) {
          if (feature.label.trim()) {
            await api.post('/api/projectfeatures/', {
              project: newProject.id,
              label: feature.label.trim(),
              icon: feature.icon.trim(),
              variant: feature.variant,
            });
          }
        }
      }

      setSuccess(true);

      setTimeout(() => {
        onProjectAdded();
        onClose();
        // Reset form
        setFormData({ title: '', description: '', live_link: '', github_link: '', tech_stack: '', featured: false, order: 0 });
        setThumbnail(null);
        setPreviewUrl(null);
        setFeatures([]);
        setSuccess(false);
      }, 1400);
    } catch (err) {
      console.error(err);
      alert('Failed to create project. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 bg-black/70 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glass w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Fixed Header */}
            <div className="px-6 md:px-8 py-6 border-b border-slate-700 flex items-center justify-between shrink-0">
              <h2 className="text-2xl font-heading tracking-tighter">Add New Project</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              {/* Title */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">PROJECT TITLE</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 focus:border-accent outline-none"
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">THUMBNAIL</label>
                <div className="border border-dashed border-slate-600 rounded-3xl p-6 text-center hover:border-accent transition-colors">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-2xl object-cover" />
                  ) : (
                    <Upload className="w-8 h-8 mx-auto text-slate-400 mb-3" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                    id="thumbnail"
                  />
                  <label htmlFor="thumbnail" className="cursor-pointer text-sm text-accent hover:underline">
                    {previewUrl ? 'Change thumbnail' : 'Click to upload image'}
                  </label>
                </div>
              </div>

              {/* === FEATURES SECTION === */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-xs font-mono text-slate-400">PROJECT FEATURES</label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-cyan-300"
                  >
                    <Plus className="w-4 h-4" /> Add Feature
                  </button>
                </div>

                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="glass rounded-3xl p-5 flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="text-xs text-slate-400 block mb-1">Label</label>
                        <input
                          type="text"
                          value={feature.label}
                          onChange={(e) => updateFeature(index, 'label', e.target.value)}
                          placeholder="e.g. Featured Work"
                          className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm"
                        />
                      </div>
                      <div className="w-28">
                        <label className="text-xs text-slate-400 block mb-1">Icon</label>
                        <input
                          type="text"
                          value={feature.icon}
                          onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                          placeholder="star"
                          className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm"
                        />
                      </div>
                      <div className="w-32">
                        <label className="text-xs text-slate-400 block mb-1">Variant</label>
                        <select
                          value={feature.variant}
                          onChange={(e) => updateFeature(index, 'variant', e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm"
                        >
                          <option value="accent">Accent</option>
                          <option value="success">Success</option>
                          <option value="warning">Warning</option>
                          <option value="info">Info</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-slate-400 hover:text-red-400 pb-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">DESCRIPTION (Markdown supported)</label>
                <textarea
                  rows={5}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-3xl px-6 py-4 focus:border-accent outline-none resize-none"
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">TECH STACK (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Tailwind, Django, Framer Motion"
                  value={formData.tech_stack}
                  onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 focus:border-accent outline-none"
                />
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-2">LIVE LINK</label>
                  <input
                    type="url"
                    value={formData.live_link}
                    onChange={(e) => setFormData({ ...formData, live_link: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-2">GITHUB LINK</label>
                  <input
                    type="url"
                    value={formData.github_link}
                    onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 focus:border-accent outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 accent"
                  />
                  <span className="text-sm">Featured Project</span>
                </label>

                <div>
                  <label className="text-xs font-mono text-slate-400">ORDER</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-20 ml-3 bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-center"
                  />
                </div>
              </div>
            </div>

            {/* Fixed Submit Button */}
            <div className="shrink-0 p-6 md:p-8 border-t border-slate-700">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || success}
                className="w-full py-5 bg-accent text-black font-semibold rounded-3xl hover:bg-cyan-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>Creating Project...</>
                ) : success ? (
                  <>
                    <CheckCircle className="w-5 h-5" /> Project Added!
                  </>
                ) : (
                  'Add Project'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}