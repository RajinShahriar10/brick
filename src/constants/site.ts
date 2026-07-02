import type { SiteConfig, NavItem } from "@/types";

export const siteConfig: SiteConfig = {
  name: "BRICK ÉLITE",
  tagline: "The World's Most Exclusive Red Brick",
  description: "Experience unparalleled craftsmanship. A single red brick, reimagined for the discerning collector.",
  url: "https://brick-elite.vercel.app",
  ogImage: "https://brick-elite.vercel.app/og.jpg",
  links: {
    twitter: "https://twitter.com/brickelite",
    github: "https://github.com/brickelite",
  },
};

export const navItems: NavItem[] = [
  { title: "The Brick", href: "#product" },
  { title: "Features", href: "#features" },
  { title: "Specifications", href: "#specs" },
  { title: "Testimonials", href: "#testimonials" },
  { title: "FAQ", href: "#faq" },
  { title: "Contact", href: "#contact" },
];

export const features = [
  {
    title: "Hand-Selected Clay",
    description: "Each brick begins with clay sourced from a single, secret quarry in Tuscany, aged for a minimum of 18 months.",
    icon: "Mountain",
  },
  {
    title: "Kiln-Fired at 2,200°F",
    description: "Our proprietary firing process runs for 72 continuous hours, yielding a density and color depth unmatched in modern masonry.",
    icon: "Flame",
  },
  {
    title: "Precision-Milled",
    description: "CNC-machined to within 0.1mm tolerance. Every face is perfectly orthogonal, every edge razor-sharp.",
    icon: "Ruler",
  },
  {
    title: "Acoustic Tuned",
    description: "Tap this brick. It rings at a perfect A440 — the same resonant frequency as a concert tuning fork.",
    icon: "Music",
  },
  {
    title: "Hydrophobic Seal",
    description: "A 12-layer nano-ceramic coating repels water, oil, and graffiti. It will look pristine for a century.",
    icon: "Droplets",
  },
  {
    title: "Serialized & Certified",
    description: "Every brick is laser-etched with a unique serial number, accompanied by a certificate of authenticity.",
    icon: "Fingerprint",
  },
];

export const specs = [
  { label: "Material", value: "Premium Clay Alloy™", icon: "🧱" },
  { label: "Compression Strength", value: "9,999 MPa", icon: "💪" },
  { label: "Class", value: "Ultra-Luxury Building Material", icon: "👑" },
  { label: "Exclusivity", value: "Limited to 10,000,000 Pieces Worldwide", icon: "🎯" },
  { label: "Lifetime", value: "Several Centuries", icon: "⏳" },
  { label: "Weight", value: "2.4 kg — Purposeful Density", icon: "🏋️" },
  { label: "Aerodynamic Drag", value: "Cd 0.82 — Consistent with Its Form", icon: "🛩️" },
  { label: "Color", value: "\u201CRed\u201D (Patent Pending)", icon: "🎨" },
  { label: "Acoustic Signature", value: "Deep, Single-Frequency Resonance (A440)", icon: "🔊" },
  { label: "Connectivity", value: "Analog by Design", icon: "📡" },
  { label: "Ownership Model", value: "Perpetual — No Recurring Fees", icon: "💰" },
  { label: "Carbon Footprint", value: "Net-Zero Certified", icon: "🌱" },
  { label: "Unboxing Experience", value: "Archival-Grade Presentation", icon: "📦" },
  { label: "Resale Value", value: "Appreciating Asset Class", icon: "📈" },
];

export const testimonials = [
  {
    content: "I've specified materials for projects on four continents, and nothing has sparked conversation quite like Brick \u00c9LITE. Its presence is understated yet unforgettable.",
    author: "Daniel Whitmore",
    role: "Principal Architect, Whitmore Studio",
    rating: 5,
  },
  {
    content: "Most building materials serve a purpose. Brick \u00c9LITE creates an experience. It's the kind of product that transforms an ordinary space into a statement.",
    author: "Sophia Laurent",
    role: "Luxury Property Developer",
    rating: 5,
  },
  {
    content: "I originally purchased one as a conversation piece. It quickly became the centerpiece of my collection. Guests ask about it before anything else.",
    author: "Marcus Reed",
    role: "Private Design Collector",
    rating: 5,
  },
  {
    content: "Exceptional craftsmanship, timeless character, and an attention to detail rarely seen today. Brick \u00c9LITE proves that even the simplest objects can feel extraordinary.",
    author: "Amelia Brooks",
    role: "Creative Director, Atelier House",
    rating: 5,
  },
  {
    content: "The unboxing experience alone felt more premium than products costing ten times as much. Every detail communicates quality.",
    author: "Ethan Carter",
    role: "Founder & CEO",
    rating: 5,
  },
  {
    content: "As designers, we constantly search for objects that tell a story. Brick \u00c9LITE delivers heritage, character, and elegance in a single form.",
    author: "Olivia Bennett",
    role: "Senior Interior Designer",
    rating: 5,
  },
  {
    content: "I've spent my career analyzing materials. I never expected a brick to inspire this level of admiration. It's engineering elevated into art.",
    author: "Dr. Nathan Hughes",
    role: "Structural Engineer",
    rating: 5,
  },
  {
    content: "A masterclass in branding and presentation. Brick \u00c9LITE successfully turns the ordinary into something aspirational and desirable.",
    author: "Editorial Team",
    role: "Modern Luxury Living Magazine",
    rating: 5,
  },
  {
    content: "There's a certain confidence in creating something so simple yet so compelling. Brick \u00c9LITE embodies that philosophy perfectly.",
    author: "Isabella Grant",
    role: "Chief Technology Officer",
    rating: 5,
  },
  {
    content: "I've invested in watches, artwork, and rare collectibles. Somehow, this remains one of the most talked-about pieces in my office.",
    author: "Anonymous Collector",
    role: "Private Client",
    rating: 5,
  },
];

export const faq = [
  {
    question: "How is it different from a normal brick?",
    answer: "A standard brick costs $0.50, has ±5mm tolerance, absorbs up to 25% water, and crumbles in a century. Our brick costs more, is machined to ±0.1mm, repels all moisture, and will outlast your great-grandchildren.",
  },
  {
    question: "Is it actually worth the price?",
    answer: "Value is subjective. If you appreciate the intersection of ancient craft and modern precision engineering, yes. If you need to pave a driveway, no.",
  },
  {
    question: "How is it shipped?",
    answer: "Each brick is individually wrapped in Japanese washi paper, placed in a CNC-milled cedar box, surrounded by memory foam, and shipped in a double-walled corrugated crate. Shipping is complimentary worldwide.",
  },
  {
    question: "Can I return it?",
    answer: "If the brick arrives damaged, we will replace it immediately. If you simply change your mind, we offer a 30-day satisfaction guarantee — though no one has ever exercised it.",
  },
];
