export const PORTFOLIO_EMBED_SECTIONS = ["selected_work", "reels"] as const;

export type PortfolioEmbedSection = (typeof PORTFOLIO_EMBED_SECTIONS)[number];

export type PortfolioEmbed = {
  id: string;
  section: PortfolioEmbedSection;
  instagramUrl: string;
  sortOrder: number;
  published: boolean;
};
