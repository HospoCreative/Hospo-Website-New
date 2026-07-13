// Image folder settings.
// To add most images, place the file in the matching public/images folder.
// The site automatically reads .jpg, .jpeg, .png, .webp and .avif files.

export const imageFolders = {
  heroBackground: "images/hero/background",
  heroCollage: "images/hero/collage",
  photoGallery: "images/gallery",
  movingStrip: "images/strip",
  instagramFeed: "images/social/instagram"
} as const;

// Optional alt text for the moving image strip.
// New files in public/images/strip appear automatically.
export const movingStripImageText = {
  "strip-01.jpg": {
    alt: "Boutique resort pool and hospitality architecture"
  },
  "strip-02.jpg": {
    alt: "Restaurant table with drinks and plated food"
  },
  "strip-03.jpg": {
    alt: "Coastal landscape captured for a hospitality brand"
  },
  "strip-04.jpg": {
    alt: "A travel couple on a boutique hotel balcony"
  },
  "strip-05.jpg": {
    alt: "Spa and wellness details in a tropical resort"
  },
  "strip-06.jpg": {
    alt: "Luxury villa and pool atmosphere"
  },
  "strip-07.jpg": {
    alt: "Cinematic coastal resort at golden hour"
  },
  "strip-08.jpg": {
    alt: "Hospitality food and beverage detail"
  }
} as const;

// Optional alt text for the photo gallery slider.
// New files in public/images/gallery appear automatically.
export const photoGalleryImageText = {
  "gallery-01.jpg": {
    alt: "Luxury hotel pool captured at golden hour"
  },
  "gallery-02.jpg": {
    alt: "Coastal villa and hospitality atmosphere"
  },
  "gallery-03.jpg": {
    alt: "Restaurant table with cocktails and plated dishes"
  },
  "gallery-04.jpg": {
    alt: "Coastal view captured for a hospitality portfolio"
  },
  "gallery-05.jpg": {
    alt: "Lifestyle content captured for a hospitality brand"
  },
  "gallery-06.jpg": {
    alt: "Tropical spa and wellness details"
  },
  "gallery-07.jpg": {
    alt: "Luxury villa pool and architecture"
  },
  "gallery-08.jpg": {
    alt: "Food and beverage details for hospitality brands"
  },
  "gallery-09.jpg": {
    alt: "Aerial coastal view captured for a hospitality brand"
  },
  "gallery-10.jpg": {
    alt: "Travel-led couple portrait at a boutique stay"
  },
  "gallery-11.jpg": {
    alt: "Hospitality wellness detail with calm textures"
  },
  "gallery-12.jpg": {
    alt: "Cinematic resort scene for hospitality storytelling"
  }
} as const;
