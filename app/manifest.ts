import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hospo Creative",
    short_name: "Hospo",
    description: "Marketing, photography and digital optimisation for guest-led brands.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#002c5d",
    icons: [{ src: "/images/social/hospo-favicon.png", sizes: "500x500", type: "image/png" }]
  };
}
