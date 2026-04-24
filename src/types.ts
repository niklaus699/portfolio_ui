export interface ProjectFeature {
  label: string;
  icon?: string;
  variant: 'accent' | 'success' | 'warning' | 'info';
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  description: string;
  tech_stack: string[];
  live_link?: string;
  github_link?: string;
  featured: boolean;
  order: number;
  created_at: string;
  features?: ProjectFeature[];   // ← Add this
}