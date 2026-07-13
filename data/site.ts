// Main editable website copy, links and hero images.
// Change this file first when updating the landing page message.
export const siteContent = {
  metadata: {
    title: "Hospo Creative | Hospitality Marketing & Creative Agency",
    description:
      "Hospo Creative helps hotels, restaurants and hospitality brands strengthen discovery, content, campaigns, websites and booking touchpoints."
  },
  navItems: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Approach", href: "#approach" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" }
  ],
  contact: {
    email: "info@hospoagency.com",
    instagramHandle: "@hospo.agency",
    instagramUrl: "https://www.instagram.com/hospo.agency/",
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/hospo.agency/" },
      { label: "Website", href: "https://www.hospoagency.com" }
    ]
  },
  hero: {
    eyebrow: "Hospitality marketing & creative agency",
    title: "Hospitality marketing that turns attention into action.",
    body: [
      "We help hotels, restaurants and hospitality brands strengthen how they are discovered, presented and booked through strategy, social media, campaigns, advertising, websites and creative content."
    ],
    primaryCta: "View Our Work",
    secondaryCta: "Start a Project",
    labels: [
      "Hotels",
      "Restaurants",
      "Bars",
      "Cafes",
      "Food & Drink",
      "Guest Experience"
    ],
    backgroundImage: {
      src: "/images/hero/collage/1.jpg",
      alt: "Portrait hospitality image used for Hospo Creative"
    },
    galleryImages: [
      {
        src: "/images/hero/portrait.jpg",
        alt: "Vertical hospitality portfolio image with a pool and tropical setting"
      },
      {
        src: "/images/work/food.jpg",
        alt: "Restaurant table and drinks captured for hospitality content"
      },
      {
        src: "/images/work/wellness.jpg",
        alt: "Spa and wellness details captured for a hospitality brand"
      },
      {
        src: "/images/work/places.jpg",
        alt: "Coastal view captured for hospitality storytelling"
      }
    ]
  },
  positioning: {
    eyebrow: "Guest journey",
    title: "Digital marketing built around the complete guest journey.",
    body:
      "A guest may discover your business through social media, Google, an advertisement, an OTA listing or a recommendation. Hospo helps make every stage stronger, from the first impression to the final booking.",
    supporting:
      "While you focus on delivering memorable hospitality experiences, we support the strategy, content, visibility and digital touchpoints that help guests find and choose your business."
  },
  about: {
    eyebrow: "Who We Are",
    title: "Hospitality is not simply our niche. It is our background.",
    body: [
      "Hospo Creative combines hospitality marketing, visual storytelling and hands-on industry experience to help hotels, restaurants and hospitality brands build a stronger digital presence.",
      "We understand that running a hospitality business requires constant attention. While your team focuses on delivering the guest experience, we support the strategy, content, campaigns and digital touchpoints that help people discover and choose your business."
    ],
    linkLabel: "Discuss Your Marketing",
    founders: [
      {
        name: "Andreia Oliveira",
        role: "Marketing Director and Creative Strategist",
        bio:
          "More than seven years of hospitality marketing experience across strategy, social media, campaigns, Google Ads, websites, SEO and email marketing."
      },
      {
        name: "Tiago Bastos",
        role: "Photographer, Videographer and Hospitality Creative",
        bio:
          "Approximately 15 years of hospitality experience combined with photography, videography, content creation and visual storytelling."
      }
    ],
    image: {
      src: "/images/about/andreia-tiago.jpg",
      alt: "Andreia and Tiago on a boutique hotel balcony"
    }
  },
  work: {
    eyebrow: "Selected Work",
    title: "Selected hospitality work.",
    body:
      "Photography, campaigns and digital marketing created to help hospitality brands build stronger visibility, communicate their experience and turn interest into action."
  },
  photoGallery: {
    eyebrow: "Portfolio in motion",
    title: "Portrait moments assembled into one hospitality story.",
    body:
      "Images begin as separate moments, then settle into a complete visual system: food, rooms, drinks, details, people and atmosphere working together."
  },
  reels: {
    eyebrow: "Campaign content",
    title: "Content made for the channels your guests already use.",
    label: "Native video and campaign previews",
    body:
      "From Reels and campaign videos to advertising assets and website content, we create practical visual material shaped around where and how it will be used."
  },
  services: {
    eyebrow: "How We Help",
    title: "Practical marketing support for hospitality brands that want to be easier to find, trust and book.",
    body:
      "Running a hospitality business already demands your full attention. Hospo supports the marketing work around it, helping you build visibility, improve your digital presence and communicate your guest experience more clearly."
  },
  journey: {
    eyebrow: "Integrated approach",
    title: "From attention to action.",
    body:
      "A guest rarely moves in a straight line. They may discover your business through social media, search on Google, compare an OTA listing, visit your website and return later through an email or advertisement. Hospo helps these touchpoints work together.",
    stages: [
      {
        title: "Discovery",
        channels: "Social media, photography, video, Google Search"
      },
      {
        title: "Interest",
        channels: "Campaign creative, Reels, ads, reviews"
      },
      {
        title: "Consideration",
        channels: "Website, OTA, menus, room pages, landing pages"
      },
      {
        title: "Booking",
        channels: "Reservation journeys, enquiry pages, booking links"
      },
      {
        title: "Retention",
        channels: "Email, remarketing, guest communication"
      }
    ]
  },
  proof: {
    eyebrow: "Hospitality focus",
    title: "Built for the businesses your guests search, compare and remember.",
    body:
      "We support hospitality brands across restaurants, hotels, food, drink, accommodation and guest experiences. Client logos and testimonials can be added when supplied.",
    sectors: ["Hotels", "Restaurants", "Bars", "Cafes", "Food & drink", "Accommodation"]
  },
  cta: {
    eyebrow: "Service enquiry",
    title: "Ready to strengthen your hospitality marketing?",
    body:
      "Tell us about your business, the challenges you are facing and the support you are looking for. We will review your enquiry and discuss how Hospo may be able to help.",
    note:
      "For quick enquiries, email info@hospoagency.com directly.",
    primaryCta: "Enquire About Our Services",
    secondaryCta: "Email Us"
  },
  footer: {
    description:
      "Hospitality marketing, photography, content and digital optimisation for hotels, restaurants and hospitality brands.",
    copyright: "Hospo Creative. All rights reserved."
  }
} as const;
