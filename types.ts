
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
