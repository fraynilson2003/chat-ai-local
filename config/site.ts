export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Chat IA local",
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
    github: "https://github.com/fraynilson2003/chat-ai-local",
  },
};
