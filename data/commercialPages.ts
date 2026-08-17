export type CommercialPillar = {
  title: string;
  description: string;
  items: string[];
};

export type CommercialHub = {
  slug: "hotels-stays" | "restaurants-fb";
  eyebrow: string;
  title: string;
  description: string;
  audience: string;
  pillars: CommercialPillar[];
  journey?: string[];
  relatedServiceSlugs: string[];
  relatedCaseStudies: string[];
};

export type ServicePage = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  outcomes: string[];
  relatedHub: CommercialHub["slug"] | "both";
};

export const commercialHubs: Record<CommercialHub["slug"], CommercialHub> = {
  "hotels-stays": {
    slug: "hotels-stays",
    eyebrow: "For hotels & stays",
    title: "Marketing and digital optimisation for hotels and stays.",
    description: "A structured foundation for independent hotels, boutique stays, guesthouses, aparthotels and growing accommodation groups that want to improve how guests discover, compare and book them online.",
    audience: "Independent hotels, boutique hotels, guesthouses, aparthotels, tourism accommodation and small hotel groups.",
    pillars: [
      { title: "Website & Direct Booking", description: "Make the experience, value and next step clear across the website and booking journey.", items: ["Website UX and mobile experience", "Booking engine journey", "Conversion optimisation", "Landing pages and SEO fundamentals"] },
      { title: "OTA Optimisation", description: "Improve the presentation and consistency of your property across the platforms guests use to compare.", items: ["Listing presentation", "Photography and room descriptions", "Amenities and content consistency", "Direct and OTA journey review"] },
      { title: "CRM & Guest Retention", description: "Use guest communications and seasonal campaigns to encourage return stays and direct relationships.", items: ["Email and guest database", "Segmentation and lifecycle", "Pre and post-stay communication", "Repeat stay campaigns"] },
      { title: "Reputation & Reviews", description: "Make reviews and guest sentiment part of the trust-building journey.", items: ["Google and OTA reviews", "Response strategy", "Guest sentiment", "Reputation insights"] },
      { title: "Analytics & Performance", description: "Connect acquisition, booking journey and conversion signals to clearer commercial decisions.", items: ["GA4 and tracking readiness", "Acquisition channels", "Direct booking KPIs", "Reporting and insights"] }
    ],
    journey: ["Search, Google, social and OTAs", "Website", "Booking journey", "Guest stay", "Review", "CRM", "Repeat direct booking"],
    relatedServiceSlugs: ["websites-direct-booking", "ota-optimisation", "seo-google-visibility", "photography-video", "strategy-campaigns"],
    relatedCaseStudies: ["pullman-danang-beach-resort", "grand-tourane-hotel", "yotel-porto"]
  },
  "restaurants-fb": {
    slug: "restaurants-fb",
    eyebrow: "For restaurants & F&B",
    title: "Marketing that turns attention into reservations, orders and repeat visits.",
    description: "A commercial foundation for restaurants, bars, coffee shops, food-led venues, hospitality groups and F&B concepts that need clearer demand generation and digital presentation.",
    audience: "Restaurants, bars, coffee shops, food-led venues, hospitality groups and F&B concepts.",
    pillars: [
      { title: "Strategy & Campaigns", description: "Build campaigns around the occasions, products and commercial periods that matter most.", items: ["Seasonal planning", "New menus and launches", "Offers and occasions", "Commercial calendar"] },
      { title: "Social Media & Content", description: "Keep your food, experience and reasons to visit visible and recognisable.", items: ["Content planning", "Social channels", "Short-form video", "Campaign distribution"] },
      { title: "Photography & Video", description: "Show the atmosphere, products and people behind the experience with useful commercial assets.", items: ["Food and drink", "Venue and atmosphere", "Campaign assets", "Platform-ready production"] },
      { title: "Discovery & Conversion", description: "Make the offer, location and path to reserve, enquire or order easy to understand.", items: ["Google and local visibility", "Website and reservation journey", "Menus and offers", "Paid media"] },
      { title: "Retention & Performance", description: "Use guest communication, reviews and reporting to improve what happens after the first visit.", items: ["Guest retention", "Review signals", "Creator partnerships", "Performance reporting"] }
    ],
    relatedServiceSlugs: ["strategy-campaigns", "social-media", "photography-video", "seo-google-visibility", "websites-direct-booking"],
    relatedCaseStudies: ["beleza-rodizio-instagram-growth", "itihaas-private-dining-room", "ashas-award-winning-restaurant"]
  }
};

export const servicePages: ServicePage[] = [
  { slug: "strategy-campaigns", title: "Strategy & Campaigns", eyebrow: "Commercial campaigns", description: "Campaigns built around what you need to sell, from the commercial goal through to creative, distribution and reporting.", outcomes: ["Clarify the commercial goal", "Shape a stronger offer and proposition", "Connect landing pages, content and distribution", "Measure what the campaign changes"], relatedHub: "both" },
  { slug: "websites-direct-booking", title: "Websites & Direct Booking", eyebrow: "Conversion journeys", description: "Websites and digital journeys that help potential guests understand the experience and take the next commercial step.", outcomes: ["Clear mobile experience", "Stronger booking or reservation journey", "Landing pages for offers", "Conversion-focused structure"], relatedHub: "both" },
  { slug: "ota-optimisation", title: "OTA Optimisation", eyebrow: "Accommodation presentation", description: "Presentation, content consistency and booking-platform journeys for accommodation businesses, without claiming revenue-management services.", outcomes: ["Listing presentation", "Photography and content review", "Amenity and room clarity", "Direct versus OTA journey review"], relatedHub: "hotels-stays" },
  { slug: "seo-google-visibility", title: "SEO & Google Visibility", eyebrow: "Search visibility", description: "Search-informed website structure and local visibility that make it easier for guests to understand and find your business.", outcomes: ["On-page SEO foundations", "Google Business Profile optimisation", "Local search clarity", "Search-informed content"], relatedHub: "both" },
  { slug: "photography-video", title: "Photography & Video", eyebrow: "Commercial visual assets", description: "Photography and video created for websites, campaigns, social channels and booking-platform presentation.", outcomes: ["Experience-led imagery", "Campaign assets", "Website and OTA content", "Short-form video"], relatedHub: "both" },
  { slug: "social-media", title: "Social Media", eyebrow: "Ongoing visibility", description: "Social content and channel planning that keep your business visible, relevant and connected to commercial priorities.", outcomes: ["Content planning", "Channel strategy", "Campaign support", "Ongoing optimisation"], relatedHub: "both" }
];

export const servicePageBySlug = Object.fromEntries(servicePages.map((service) => [service.slug, service]));
