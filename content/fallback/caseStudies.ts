import { selectedProjects } from "@/data/portfolio";
import type { CaseStudy } from "@/types/caseStudy";

export const fallbackCaseStudies: CaseStudy[] = selectedProjects.map(
  (project, index) => ({
    title: project.type,
    slug: project.type
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    clientName: "Hospitality project",
    location: null,
    sector: "Hospitality",
    summary: project.objective,
    challenge: null,
    solution: null,
    result: null,
    services: project.services,
    heroImage: project.images[0]?.src ?? null,
    heroImageAlt: project.images[0]?.alt ?? null,
    featured: index < 3,
    displayOrder: index,
    status: "published",
    publishedAt: null,
    media: project.images.map((image, mediaIndex) => ({
      mediaType: "image",
      src: image.src,
      alt: image.alt,
      caption: null,
      sortOrder: mediaIndex,
      published: true
    }))
  })
);
