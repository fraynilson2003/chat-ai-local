export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Chat AI local",
  description: "Chat de inteligencia artificial local, sin internet",
  navItems: [
    {
      label: "Principal",
      href: "/",
    },
    {
      label: "Chat",
      href: "/chat",
    },
  ],
  navMenuItems: [
    {
      label: "Principal",
      href: "/",
    },
    {
      label: "Chat",
      href: "/chat",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    discord: "https://discord.gg/9b6yyZKmH4",
  },
};
