// Image folder settings.
// To add most images, place the file in the matching public/images folder.
// The site automatically reads .jpg, .jpeg, .png, .webp and .avif files.

export const imageFolders = {
  heroBackground: "images/hero/background",
  heroCollage: "images/hero/collage",
  photoGallery: "images/gallery",
  instagramFeed: "images/social/instagram"
} as const;

// Optional alt text for the photo gallery slider.
// New files in public/images/gallery appear automatically.
export const photoGalleryImageText = {
  "gallery-01.jpg": {
    alt: "Luxury hotel pool captured at golden hour"
  },
  "gallery-02.jpg": {
    alt: "Coastal villa and relaxed atmosphere"
  },
  "gallery-03.jpg": {
    alt: "Restaurant table with cocktails and plated dishes"
  },
  "gallery-04.jpg": {
    alt: "Coastal view captured for the portfolio"
  },
  "gallery-05.jpg": {
    alt: "Lifestyle content captured for a client brand"
  },
  "gallery-06.jpg": {
    alt: "Tropical spa and wellness details"
  },
  "gallery-07.jpg": {
    alt: "Luxury villa pool and architecture"
  },
  "gallery-08.jpg": {
    alt: "Food and beverage details for client brands"
  },
  "gallery-09.jpg": {
    alt: "Aerial coastal view captured for a client brand"
  },
  "gallery-10.jpg": {
    alt: "Travel-led couple portrait at a boutique stay"
  },
  "gallery-11.jpg": {
    alt: "Wellness detail with calm textures"
  },
  "gallery-12.jpg": {
    alt: "Cinematic resort scene for destination storytelling"
  }
} as const;
