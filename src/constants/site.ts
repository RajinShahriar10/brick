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
  { label: "Luxury Rating", value: "★★★★★", icon: "👑" },
  { label: "Exclusivity", value: "Only 10,000,000 Available Worldwide", icon: "🎯" },
  { label: "Lifetime", value: "Several Centuries", icon: "⏳" },
  { label: "Weight", value: "Surprisingly Heavy™", icon: "🏋️" },
  { label: "Aerodynamic Drag", value: "Negligible (It\u2019s a brick)", icon: "🛩️" },
  { label: "Color", value: "\u201CRed\u201D (Patent Pending)", icon: "🎨" },
  { label: "Sound When Dropped", value: "Satisfying Thud", icon: "🔊" },
  { label: "Wi-Fi Pass-Through", value: "None (Intentional)", icon: "📡" },
  { label: "Monthly Subscription", value: "Not Required", icon: "💰" },
  { label: "Carbon Footprint", value: "0 (We Count Differently)", icon: "🌱" },
  { label: "Unboxing Experience", value: "Life-Changing", icon: "📦" },
  { label: "Resale Value", value: "Appreciating", icon: "📈" },
];

export const testimonials = [
  {
    content: "We specified the Elite series for our flagship tower facade. The color consistency and dimensional tolerance exceeded our expectations. It\u2019s rare to find a brick that performs this well at scale.",
    author: "James Cartwright",
    role: "Principal Architect, Cartwright Partners, London",
  },
  {
    content: "I\u2019ve been restoring heritage buildings for twenty-three years. This is the first brick I\u2019ve seen that genuinely matches the texture and warmth of hand-moulded originals. A remarkable achievement.",
    author: "Eleanor Vasquez",
    role: "Conservation Specialist, Historic Properties Trust",
  },
  {
    content: "We used BRICK\u00c9LITE for our private residence in Palm Springs. The thermal mass performance is outstanding, and the finish photographs beautifully. Clients are already asking for referrals.",
    author: "David Okafor",
    role: "Managing Director, Okafor Development Group",
  },
  {
    content: "The frog indentations and wire-cut detailing give it an authenticity most modern bricks lack. It bridges craft and engineering in a way the market has been hungry for.",
    author: "Sophie Laroche",
    role: "Design Critic, Architecture Today",
  },
  {
    content: "Our showroom installation using the Elite brick has generated more qualified leads than any other material display we\u2019ve done. It commands attention without trying.",
    author: "Marcus Chen",
    role: "Creative Director, Studio Chen Interiors",
  },
  {
    content: "Load-testing confirmed compressive strength well above industry standards. For a brick this refined, the structural integrity is genuinely impressive.",
    author: "Dr. Amina Tariq",
    role: "Structural Engineer, Arup",
  },
  {
    content: "I sourced these for a private library project in Zurich. The clay body has a depth of colour that changes beautifully throughout the day. Truly a material that rewards close attention.",
    author: "Lena G\u00fcnther",
    role: "Material Curator, Bauatelier",
  },
  {
    content: "We featured BRICK\u00c9LITE in our annual design biennial as an example of contemporary craftsmanship. It sparked more conversation than any digital installation in the exhibition.",
    author: "Tomas Rivera",
    role: "Curator of Decorative Arts, V&A Museum",
  },
];

export const faq = [
  {
    question: "Is this a joke?",
    answer: "No. BRICK ÉLITE is a serious product for serious collectors. Our bricks are precision-engineered in limited batches. We recommend watching the product video before judging.",
  },
  {
    question: "What can I do with a BRICK ÉLITE?",
    answer: "Display it. Hold it. Tap it (it rings at A440). Use it as a paperweight. Build a small, exceptionally expensive wall. Our collectors have used them as bookends, doorstops, meditation objects, and sound design tools.",
  },
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
