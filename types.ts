
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
  /** Same-origin mirror voor de live embed (omzeilt X-Frame-Options) */
  previewUrl?: string;
  fullPageScreenshot?: string;
  metrics?: ProjectMetric[];
  /** Site blokkeert iframes (X-Frame-Options); toon het beeld i.p.v. live embed */
  noEmbed?: boolean;
}

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
  readTime?: string;
  tags?: string[];
  body: string;
  faqs?: BlogFAQ[];
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
