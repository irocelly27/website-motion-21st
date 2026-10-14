export type Slide = {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  active: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  price: string;
  cover: string;
  gallery: string[];
  features: string[];
  featured: boolean;
};

export type Stat = {
  value: number;
  suffix: string;
  label: string;
};

export type Settings = {
  companyName: string;
  tagline: string;
  marquee: string[];
  aboutTitle: string;
  aboutText: string;
  stats: Stat[];
  ctaTitle: string;
  ctaText: string;
  email: string;
  phone: string;
  address: string;
};

export type Content = {
  settings: Settings;
  slides: Slide[];
  products: Product[];
};
