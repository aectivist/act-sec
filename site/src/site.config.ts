// Single source of truth for the customizable parts of the site.
// The actual editable data lives in ./site.data.json — the admin dashboard's
// "Site Settings" page reads and rewrites that JSON file directly. Editing
// site.data.json by hand works identically to editing it through the admin app.
import raw from './site.data.json';

export interface SiteConfig {
  name: string;
  /** Site/domain brand shown in the nav wordmark and browser-tab title (e.g. "act-sec") — distinct from `name`, the person's real name. */
  brand: string;
  titles: string[];
  about: string;
  logo: string;
  contact: {
    email: string;
    location: string;
  };
  socials: { label: string; url: string; icon: string }[];
  nav: { label: string; href: string }[];
  themeOverrides: Partial<{
    accent: string;
    accentSoft: string;
    bg: string;
    bgElevated: string;
  }>;
}

export const siteConfig = raw as SiteConfig;
