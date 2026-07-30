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
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }]
  };
}

