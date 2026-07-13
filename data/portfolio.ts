export type ValueCard = {
  title: string;
  body: string;
};

export type ProjectFeature = {
  client: string;
  type: string;
  location: string;
  objective: string;
  services: string[];
  images: Array<{
    src: string;
    alt: string;
  }>;
};

export const selectedProjects: ProjectFeature[] = [
  {
    client: "[CLIENT NAME REQUIRED]",
    type: "Restaurant content system",
    location: "[LOCATION REQUIRED]",
    objective:
      "Create a stronger visual first impression and a clearer content rhythm for social media, campaign pages and guest communications.",
    services: ["Photography", "Short-form content", "Social media direction"],
    images: [
      {
        src: "/images/gallery/1.jpg",
        alt: "Portrait restaurant hospitality photography"
      },
      {
        src: "/images/gallery/2.jpg",
        alt: "Restaurant food and drink content detail"
      },
      {
        src: "/images/gallery/4.jpg",
        alt: "Hospitality atmosphere captured for social media"
      },
      {
        src: "/images/gallery/9.jpg",
        alt: "Restaurant service and guest experience content"
      },
      {
        src: "/images/gallery/13.jpg",
        alt: "Hospitality food detail photographed for campaign content"
      }
    ]
  },
  {
    client: "[CLIENT NAME REQUIRED]",
    type: "Hotel and stay visibility",
    location: "[LOCATION REQUIRED]",
    objective:
      "Improve how the property is presented across website, social media and booking touchpoints with a more consistent visual story.",
    services: ["Hotel photography", "Website content", "OTA image selection"],
    images: [
      {
        src: "/images/gallery/5.jpg",
        alt: "Hotel and accommodation portrait photography"
      },
      {
        src: "/images/gallery/6.jpg",
        alt: "Hospitality stay content with pool and lifestyle detail"
      },
      {
        src: "/images/gallery/8.jpg",
        alt: "Hospitality detail image for accommodation marketing"
      },
      {
        src: "/images/gallery/1.8.jpg",
        alt: "Hotel guest touchpoint visual for hospitality marketing"
      },
      {
        src: "/images/gallery/19.jpg",
        alt: "Hotel environment and stay experience photography"
      }
    ]
  },
  {
    client: "[CLIENT NAME REQUIRED]",
    type: "Campaign asset library",
    location: "[LOCATION REQUIRED]",
    objective:
      "Build a practical bank of campaign visuals that can be used across ads, landing pages, email and seasonal promotions.",
    services: ["Campaign planning", "Photography", "Advertising creative"],
    images: [
      {
        src: "/images/gallery/10.jpg",
        alt: "Campaign hospitality portrait visual"
      },
      {
        src: "/images/gallery/12.jpg",
        alt: "Food and beverage campaign detail"
      },
      {
        src: "/images/gallery/14.jpg",
        alt: "Hospitality lifestyle campaign image"
      },
      {
        src: "/images/gallery/15.jpg",
        alt: "Food and drink campaign content for social media"
      },
      {
        src: "/images/gallery/16.jpg",
        alt: "Hospitality campaign visual with lifestyle detail"
      }
    ]
  },
  {
    client: "[CLIENT NAME REQUIRED]",
    type: "Website and booking journey",
    location: "[LOCATION REQUIRED]",
    objective:
      "Restructure the digital presentation so guests can understand the experience, find key information and move towards a booking or enquiry.",
    services: ["Website optimisation", "SEO", "Google visibility"],
    images: [
      {
        src: "/images/gallery/20.jpg",
        alt: "Hospitality website content image"
      },
      {
        src: "/images/gallery/21.jpg",
        alt: "Portrait content for booking journey"
      },
      {
        src: "/images/gallery/23.jpg",
        alt: "Digital hospitality presentation image"
      },
      {
        src: "/images/gallery/24.jpg",
        alt: "Website and booking journey hospitality visual"
      },
      {
        src: "/images/gallery/25.jpg",
        alt: "Hospitality digital touchpoint and guest journey image"
      }
    ]
  }
];
