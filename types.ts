
export interface ProjectMetric {
  label: string;
  value: string;
  color?: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  client?: string;
  year?: string;
  services?: string[];
  description: string;
  image: string;
  video?: string;
  align: 'left' | 'right';
  gallery?: string[];
  url?: string;
  fullPageScreenshot?: string;
  metrics?: ProjectMetric[];
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface StatData {
  name: string;
  value: number;
}
