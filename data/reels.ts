export type ReelItem = {
  title: string;
  category: string;
  services: string[];
  thumbnail?: string;
  videoSrc?: string;
  note?: string;
};

// Native campaign previews. Add more local videos to public/videos and connect
// them here when those files are available.
export const reels: ReelItem[] = [
  {
    title: "Restaurant campaign preview",
    category: "Short-form video",
    services: ["Reels", "Campaign video", "Social media"],
    thumbnail: "/images/reels/reel-01.jpg",
    videoSrc: "/videos/Happycurious Itihaas.mp4"
  },
  {
    title: "Food and drink story",
    category: "Campaign asset",
    services: ["Photography", "Paid social", "Landing pages"],
    thumbnail: "/images/reels/reel-02.jpg",
    note: "[VIDEO FILE REQUIRED]"
  },
  {
    title: "Guest experience sequence",
    category: "Social content",
    services: ["Reels", "Stories", "Content calendar"],
    thumbnail: "/images/reels/reel-03.jpg",
    note: "[VIDEO FILE REQUIRED]"
  },
  {
    title: "Website and ads visual",
    category: "Digital creative",
    services: ["Website content", "Meta Ads", "Google Ads"],
    thumbnail: "/images/reels/reel-04.jpg",
    note: "[VIDEO FILE REQUIRED]"
  }
];
