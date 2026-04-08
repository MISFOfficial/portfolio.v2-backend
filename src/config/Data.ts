export interface CmsProject {
  id: string;
  title: string;
  Images: string;
  tags: string[];
  year: string;
  platform: 'WordPress' | 'Shopify' | 'Webflow' | 'Wix' | 'Squarespace';
  badge?: { text: string; color: string } | null;
  description: string;
  liveUrl?: string | null;
}

export const cmsProjectsData: CmsProject[] = [
  {
    id: 'cms-1',
    title: 'TutorSheba',
    Images: 'https://i.ibb.co.com/VcCDHdLg/Images.png',
    tags: ['Education', 'LMS', 'Blog'],
    year: '2026',
    platform: 'WordPress',
    badge: { text: 'Live', color: 'bg-[#22c55e]' },
    description:
      'A professional tutor marketplace built on WordPress with custom Elementor templates, LMS integration, and SEO-optimized blog.',
    liveUrl: 'https://tutorsheba.com',
  },
  {
    id: 'cms-2',
    title: 'StyleHaven Store',
    Images: 'https://i.ibb.co.com/SDCSP6pj/Images.png',
    tags: ['Fashion', 'E-Commerce', 'Payments'],
    year: '2025',
    platform: 'Shopify',
    badge: { text: 'E-Commerce', color: 'bg-[#7c3aed]' },
    description:
      'A premium fashion e-commerce store on Shopify with custom theme development, integrated payment gateways, and inventory management.',
    liveUrl: 'https://stylehaven.store',
  },
  {
    id: 'cms-3',
    title: 'PixelCraft Agency',
    Images: 'https://i.ibb.co.com/svcPkT1V/Images.png',
    tags: ['Agency', 'Portfolio', 'Animations'],
    year: '2025',
    platform: 'Webflow',
    description:
      'A pixel-perfect creative agency portfolio on Webflow with complex CMS collections, scroll-driven animations, and client portal.',
    liveUrl: 'https://pixelcraft.agency',
  },
  {
    id: 'cms-4',
    title: 'GreenLeaf Organics',
    Images: 'https://i.ibb.co.com/8DDcrmpj/Images.png',
    tags: ['Organic', 'E-Commerce', 'Blog'],
    year: '2025',
    platform: 'WordPress',
    badge: { text: 'WooCommerce', color: 'bg-[#9333ea]' },
    description:
      'An organic food e-commerce site powered by WooCommerce with subscription-based delivery system and recipe blog integration.',
    liveUrl: 'https://greenleaforganics.com',
  },
  {
    id: 'cms-5',
    title: 'LuxeJewels',
    Images: 'https://i.ibb.co.com/dwC4TdfH/Images.png',
    tags: ['Jewelry', 'Luxury', 'Custom Theme'],
    year: '2025',
    platform: 'Shopify',
    description:
      'A high-end jewelry brand storefront with 3D product previews, custom Shopify Liquid theme, and AR try-on feature integration.',
    liveUrl: 'https://luxejewels.com',
  },
  {
    id: 'cms-6',
    title: 'NovaTech Solutions',
    Images: 'https://i.ibb.co.com/p6ZkhwLJ/Images.png',
    tags: ['SaaS', 'Landing Page', 'CMS'],
    year: '2026',
    platform: 'Webflow',
    badge: { text: 'Featured', color: 'bg-[#FF0055]' },
    description:
      'A dynamic SaaS landing page on Webflow with CMS-driven feature sections, interactive pricing calculator, and lead capture forms.',
    liveUrl: 'https://novatech.solutions',
  },
];

export function getCmsProjectById(id: string) {
  return cmsProjectsData.find((project) => project.id === id);
}
