
export interface Project {
  id: number;
  title: string;
  category: string;
  client?: string; // New
  year?: string;   // New
  services?: string[]; // New
  description: string;
  image: string;
  video?: string; // Optional video URL
  align: 'left' | 'right';
  gallery?: string[];
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
