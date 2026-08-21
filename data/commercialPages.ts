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
  journey?: { title: string; action: string; support: string }[];
  relatedServiceSlugs: string[];
};

export type ServicePage = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  audience: string;
  problem: string;
  deliverables: string[];
  process: string[];
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
    journey: [
      { title: "Discovery", action: "Discover and compare.", support: "SEO, Google visibility, campaigns, OTA presentation." },
      { title: "Website", action: "Understand the experience and offer.", support: "UX, messaging, photography and landing pages." },
      { title: "Booking journey", action: "Move from consideration to reservation.", support: "Mobile UX, booking flow and conversion structure." },
      { title: "Guest stay", action: "Experience what was promised.", support: "Pre-arrival communication and digital consistency." },
      { title: "Review", action: "Share proof and feedback.", support: "Review strategy, reputation and guest sentiment." },
      { title: "CRM", action: "Stay connected after departure.", support: "Email, segmentation and post-stay communication." },
      { title: "Repeat direct booking", action: "Return with confidence.", support: "Retention campaigns and direct rebooking communication." }
    ],
    relatedServiceSlugs: ["websites-direct-booking", "ota-optimisation", "seo-google-visibility", "photography-video", "strategy-campaigns"]
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
    relatedServiceSlugs: ["strategy-campaigns", "social-media", "photography-video", "seo-google-visibility", "websites-direct-booking"]
  }
};

export const servicePages: ServicePage[] = [
  { slug: "strategy-campaigns", title: "Strategy & Campaigns", eyebrow: "Commercial campaigns", description: "Campaigns built around what you need to sell.", audience: "For businesses with a launch, seasonal opportunity or commercial period that needs a clearer plan.", problem: "Good creative loses momentum when the offer, audience, distribution and conversion route are not connected.", deliverables: ["Commercial goal and audience", "Offer and campaign proposition", "Creative direction and content", "Distribution, landing pages and measurement"], process: ["Understand", "Prioritise", "Create", "Measure"], outcomes: ["Seasonal offers", "New menus and launches", "Private dining and packages", "Low-season demand"], relatedHub: "both" },
  { slug: "websites-direct-booking", title: "Websites & Direct Booking", eyebrow: "Conversion journeys", description: "Make it easier to understand, choose and book.", audience: "For hotels, stays and food-led businesses whose website does not make the next step clear enough.", problem: "A website should turn discovery into confidence, then a booking, reservation, enquiry or order.", deliverables: ["UX and mobile structure", "Experience and offer messaging", "Booking or reservation journey", "SEO foundations and tracking readiness"], process: ["Discover", "Clarify", "Implement", "Optimise"], outcomes: ["Clear mobile experience", "Landing pages for offers", "Conversion-focused structure", "Better booking or reservation flow"], relatedHub: "both" },
  { slug: "ota-optimisation", title: "OTA Optimisation", eyebrow: "Accommodation presentation", description: "Present your property as strongly as the experience itself.", audience: "For accommodation businesses that want stronger, more consistent listing presentation.", problem: "Guests compare listings quickly, so images, names, descriptions and amenity details need to do their commercial job.", deliverables: ["Listing presentation review", "Photography selection and sequence", "Room and amenity clarity", "Direct and OTA journey review"], process: ["Review", "Prioritise", "Refine", "Measure"], outcomes: ["Clearer room presentation", "Consistent content", "Better comparison confidence", "Stronger conversion quality"], relatedHub: "hotels-stays" },
  { slug: "seo-google-visibility", title: "SEO & Google Visibility", eyebrow: "Search visibility", description: "Be easier to find when guests are actively looking.", audience: "For businesses that need to be easier to discover in search, Maps and local comparison journeys.", problem: "Search visibility has to connect useful content, local trust signals and a website that answers intent clearly.", deliverables: ["Website SEO structure", "Google Business Profile support", "Local visibility and reputation signals", "Search-informed content opportunities"], process: ["Audit", "Prioritise", "Improve", "Review"], outcomes: ["Stronger local discovery", "Clearer metadata", "Useful landing pages", "Better search intent coverage"], relatedHub: "both" },
  { slug: "photography-video", title: "Photography & Video", eyebrow: "Commercial visual assets", description: "Visual content built for the places guests actually make decisions.", audience: "For businesses that need useful visual assets across their website, campaigns, social channels and listings.", problem: "Guests cannot choose an experience they cannot properly see, feel or understand.", deliverables: ["Photography direction and production", "Video and short-form content", "Platform-ready asset selection", "Campaign and experience imagery"], process: ["Plan", "Produce", "Select", "Deploy"], outcomes: ["Websites and OTAs", "Campaigns and paid media", "Menus and experience pages", "Social and launch content"], relatedHub: "both" },
  { slug: "social-media", title: "Social Media", eyebrow: "Ongoing visibility", description: "Stay visible, relevant and connected to commercial priorities.", audience: "For businesses that need social activity to support a clearer commercial plan.", problem: "Regular posting alone does not create demand, the content needs a reason, rhythm and measurable role.", deliverables: ["Channel and content strategy", "Content planning and publishing", "Campaign support and community visibility", "Reporting and optimisation"], process: ["Plan", "Create", "Publish", "Optimise"], outcomes: ["Consistent visibility", "Campaign momentum", "Useful content libraries", "Clearer reporting"], relatedHub: "both" }
];

export const servicePageBySlug = Object.fromEntries(servicePages.map((service) => [service.slug, service]));
