export type ServiceItem = {
  title: string;
  challenge: string;
  how: string;
  support: string[];
  image: {
    src: string;
    alt: string;
  };
};

// Services shown in the editorial service experience.
export const services: ServiceItem[] = [
  {
    title: "Social Media Management",
    challenge:
      "Your social media is inconsistent, difficult to manage or not connecting with the people most likely to visit your venue.",
    how:
      "We create and manage a clear social media presence built around your brand, audience and commercial priorities. From planning and content calendars to captions, publishing and ongoing optimisation, we help your business remain visible without adding pressure to your internal team.",
    support: [
      "Social media strategy",
      "Content calendars",
      "Instagram, Facebook and TikTok content",
      "Captions, Reels, Stories and calls to action",
      "Scheduling, publishing and reporting"
    ],
    image: {
      src: "/images/gallery/1.1.jpg",
      alt: "Hospitality social content captured in portrait format"
    }
  },
  {
    title: "Content Creation",
    challenge:
      "Your venue offers a strong real-world experience, but your online content does not communicate it clearly or consistently.",
    how:
      "We create hospitality content that helps potential guests understand the food, rooms, drinks, atmosphere, people and details that make your business worth visiting.",
    support: [
      "Social media photography",
      "Short-form video",
      "Food, drink, hotel and interior content",
      "Team and event content",
      "Platform-ready edits"
    ],
    image: {
      src: "/images/gallery/1.2.jpg",
      alt: "Portrait hospitality content showing food and atmosphere"
    }
  },
  {
    title: "Photography & Video",
    challenge:
      "Your current visuals do not capture the quality, atmosphere or personality of your hospitality experience.",
    how:
      "We produce professional photography and video that tell the story of your venue and create a stronger first impression before a guest arrives.",
    support: [
      "Food, drink and restaurant photography",
      "Hotel, interior and lifestyle photography",
      "Hospitality video and promotional films",
      "Campaign and website content",
      "OTA imagery"
    ],
    image: {
      src: "/images/gallery/5.1.jpg",
      alt: "Professional portrait hospitality photography"
    }
  },
  {
    title: "Marketing Strategy & Campaigns",
    challenge:
      "Your marketing activity feels disconnected, reactive or unclear, with no consistent direction across channels.",
    how:
      "We build tailored marketing strategies around your business, audience and priorities. We identify opportunities, create clear campaign plans and connect the channels most relevant to your goals.",
    support: [
      "Marketing audits",
      "Audience and competitor reviews",
      "Venue launches",
      "New menu and seasonal campaigns",
      "Promotional calendars and consultancy"
    ],
    image: {
      src: "/images/gallery/DSC02655.jpg",
      alt: "Hospitality campaign photography with editorial depth"
    }
  },
  {
    title: "Google Ads & Paid Social",
    challenge:
      "Your business has limited online visibility, or your current advertising is spending money without a clear strategy.",
    how:
      "We create and manage targeted Google Ads and paid social campaigns designed to reach the right audience and guide them towards a relevant page, offer, reservation or enquiry.",
    support: [
      "Google Ads and Meta Ads",
      "Campaign strategy and keyword research",
      "Audience planning and advertisement copy",
      "Creative production and location targeting",
      "Testing, reporting and ongoing optimisation"
    ],
    image: {
      src: "/images/gallery/13.jpg",
      alt: "Hospitality advertising visual asset in portrait format"
    }
  },
  {
    title: "Website Creation & Optimisation",
    challenge:
      "Your website is outdated, unclear, slow to update or making it difficult for guests to find the information they need.",
    how:
      "We create and improve hospitality websites that present the experience clearly and make important actions easier, including viewing menus, exploring rooms, understanding offers, making reservations and submitting enquiries.",
    support: [
      "Website design and creation",
      "Mobile optimisation",
      "Copy, navigation and booking links",
      "Menu, offer and event pages",
      "Landing pages and ongoing updates"
    ],
    image: {
      src: "/images/gallery/22.jpg",
      alt: "Hospitality website content photography"
    }
  },
  {
    title: "SEO & Google Visibility",
    challenge:
      "Potential guests are searching for businesses like yours, but your website and Google presence are difficult to discover or do not communicate the business clearly.",
    how:
      "We improve the structure, content and local relevance of your digital presence to help search engines and potential customers better understand your business.",
    support: [
      "Website SEO audits",
      "On-page SEO and search-informed copy",
      "Page titles, descriptions and headings",
      "Google Business Profile optimisation",
      "Local search improvements"
    ],
    image: {
      src: "/images/gallery/24.jpg",
      alt: "Local hospitality visibility content"
    }
  },
  {
    title: "OTA & Booking-Platform Optimisation",
    challenge:
      "Your OTA or booking-platform profile does not present your property, venue or experience as clearly and convincingly as it should.",
    how:
      "We review and improve how your business appears across third-party platforms, helping potential guests find clearer information, stronger photography and a more consistent presentation.",
    support: [
      "OTA profile audits",
      "Listing-copy improvements",
      "Photography selection and image ordering",
      "Amenity and offer presentation",
      "Booking-journey reviews"
    ],
    image: {
      src: "/images/gallery/30.jpg",
      alt: "Accommodation booking-platform visual content"
    }
  },
  {
    title: "Email Marketing",
    challenge:
      "You have an audience or customer database but are not communicating with them consistently or strategically.",
    how:
      "We create email campaigns that keep your business visible, communicate offers and encourage guests to return or take the next step.",
    support: [
      "Newsletter strategy",
      "Promotional and launch emails",
      "Event communications",
      "Seasonal offers and hotel packages",
      "Booking-focused calls to action"
    ],
    image: {
      src: "/images/gallery/35.jpg",
      alt: "Hospitality retention and guest communication visual"
    }
  }
];
