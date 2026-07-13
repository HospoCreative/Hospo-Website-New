import { siteContent } from "./site";

export const socialFeed = {
  eyebrow: "Socials",
  title: "Explore more from Hospo Creative.",
  body:
    "Follow our travel, food, stays and hospitality stories across the channels where we share the journey.",
  instagramUrl: siteContent.contact.instagramUrl,
  links: [
    { label: "Instagram", href: "https://www.instagram.com/hospo.agency/" },
    { label: "Website", href: "https://www.hospoagency.com" },
    { label: "Email", href: "mailto:info@hospoagency.com" }
  ]
} as const;
