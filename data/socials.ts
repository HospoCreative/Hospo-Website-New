import { siteContent } from "./site";

export const socialFeed = {
  eyebrow: "Socials",
  title: "Explore more from Hospo Creative.",
  body:
    "Follow our travel, food, stays and behind-the-scenes stories across the channels where we share the journey.",
  instagramUrl: siteContent.contact.instagramUrl,
  links: [
    { label: "Instagram", href: "https://www.instagram.com/hospo_creative/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/hospo-creative-agency" },
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61553079607457" },
    { label: "Email", href: "mailto:info@hospoagency.com" }
  ]
} as const;
