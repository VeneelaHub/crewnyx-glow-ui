export const FREELANCER_CATEGORIES = [
  "Video Editor",
  "Photo Editor",
  "Gaming",
  "Graphic Designer",
  "Web Developer",
  "Mobile Developer",
  "Content Writer",
  "Copywriter",
  "Animator",
  "3D Artist",
  "Illustrator",
  "Music & Audio",
  "Voice Over",
  "Social Media Manager",
  "SEO Specialist",
  "Translator",
  "Data Entry",
  "Virtual Assistant",
] as const;

export type FreelancerCategory = (typeof FREELANCER_CATEGORIES)[number];

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  text: string;
  date: string;
}

export interface FreelancerProject {
  id: string;
  title: string;
  description: string;
}

export interface Freelancer {
  id: string;
  name: string;
  category: FreelancerCategory;
  bio: string;
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  rank: number;
  projects: FreelancerProject[];
  reviews: Review[];
}

const seed: Omit<Freelancer, "rank">[] = [
  {
    id: "f1",
    name: "Person 1",
    category: "Video Editor",
    bio: "Cinematic video editor — 5+ yrs in YouTube & ad edits. Premiere Pro + DaVinci.",
    rating: 4.8,
    reviewCount: 132,
    projects: [
      { id: "p1", title: "Brand Ad", description: "30s social spot, 1.2M views" },
      { id: "p2", title: "YT Long-form", description: "Weekly edits for tech channel" },
    ],
    reviews: [
      { id: "r1", clientName: "Person A", rating: 5, text: "Insanely fast turnaround, top quality.", date: "2 weeks ago" },
      { id: "r2", clientName: "Person B", rating: 4, text: "Great work, minor revisions needed.", date: "1 month ago" },
    ],
  },
  {
    id: "f2",
    name: "Person 2",
    category: "Photo Editor",
    bio: "Product & portrait retoucher. Lightroom + Photoshop wizard.",
    rating: 4.9,
    reviewCount: 88,
    projects: [{ id: "p1", title: "E-com Catalog", description: "200+ products retouched" }],
    reviews: [{ id: "r1", clientName: "Person C", rating: 5, text: "Stunning edits!", date: "3 days ago" }],
  },
  {
    id: "f3",
    name: "Person 3",
    category: "Gaming",
    bio: "Gameplay editor & montage creator. CoD, Valorant, BGMI specialist.",
    rating: 4.6,
    reviewCount: 54,
    projects: [{ id: "p1", title: "Esports Highlights", description: "Tournament recap edits" }],
    reviews: [{ id: "r1", clientName: "Person D", rating: 5, text: "Sick edits 🔥", date: "1 week ago" }],
  },
  {
    id: "f4",
    name: "Person 4",
    category: "Graphic Designer",
    bio: "Logos, branding & social creatives. Clean, modern aesthetic.",
    rating: 4.7,
    reviewCount: 96,
    projects: [{ id: "p1", title: "Brand Identity", description: "Full identity for D2C startup" }],
    reviews: [{ id: "r1", clientName: "Person E", rating: 5, text: "Loved the concept.", date: "5 days ago" }],
  },
  {
    id: "f5",
    name: "Person 5",
    category: "Web Developer",
    bio: "Full-stack dev. React, Node, Postgres. Ships fast.",
    rating: 4.9,
    reviewCount: 211,
    projects: [{ id: "p1", title: "SaaS Dashboard", description: "Built MVP in 3 weeks" }],
    reviews: [{ id: "r1", clientName: "Person F", rating: 5, text: "Top dev, hire them!", date: "2 days ago" }],
  },
  {
    id: "f6",
    name: "Person 6",
    category: "Content Writer",
    bio: "SEO blogs, scripts & website copy. 4 yrs experience.",
    rating: 4.5,
    reviewCount: 67,
    projects: [{ id: "p1", title: "Blog Series", description: "SaaS content marketing" }],
    reviews: [{ id: "r1", clientName: "Person G", rating: 4, text: "Solid writing.", date: "1 week ago" }],
  },
  {
    id: "f7",
    name: "Person 7",
    category: "Animator",
    bio: "2D motion graphics & explainer videos. After Effects.",
    rating: 4.8,
    reviewCount: 73,
    projects: [{ id: "p1", title: "Explainer Video", description: "60s animated product demo" }],
    reviews: [{ id: "r1", clientName: "Person H", rating: 5, text: "Beautiful animations.", date: "4 days ago" }],
  },
  {
    id: "f8",
    name: "Person 8",
    category: "Music & Audio",
    bio: "Music producer & podcast editor. Custom tracks for brands.",
    rating: 4.7,
    reviewCount: 41,
    projects: [{ id: "p1", title: "Podcast Mix", description: "Weekly mixing for top show" }],
    reviews: [{ id: "r1", clientName: "Person I", rating: 5, text: "Crystal clear audio.", date: "1 week ago" }],
  },
];

export const FREELANCERS: Freelancer[] = seed.map((f) => ({
  ...f,
  rank: Math.round(f.rating * Math.log2(f.reviewCount + 1) * 10) / 10,
}));
