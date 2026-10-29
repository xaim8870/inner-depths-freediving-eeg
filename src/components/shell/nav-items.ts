import type { IconName } from "@/components/ui/icons";

export const primaryNav: Array<{ href: string; label: string; icon: IconName }> = [
  { href: "/app/home", label: "Home", icon: "home" },
  { href: "/app/log", label: "Log", icon: "log" },
  { href: "/app/train", label: "Train", icon: "train" },
  { href: "/app/progress", label: "Progress", icon: "progress" },
  { href: "/app/community", label: "Cove", icon: "cove" },
];

// Secondary destinations from the design's sidebar / menu. "Later" items are future-feature pages.
export const secondaryNav: Array<{ title: string; items: Array<{ href: string; label: string; later?: boolean }> }> = [
  { title: "Mind development", items: [
    { href: "/app/performance-profile", label: "Performance profile" },
    { href: "/app/coming-soon/cognitive-training", label: "Cognitive training", later: true },
    { href: "/app/coming-soon/neurofeedback", label: "Neurofeedback", later: true },
  ] },
  { title: "Your body", items: [
    { href: "/app/coming-soon/labs", label: "Labs", later: true },
    { href: "/app/coming-soon/cycle-tracking", label: "Cycle tracking", later: true },
    { href: "/app/account", label: "Connected devices" },
  ] },
  { title: "Beyond training", items: [
    { href: "/app/coming-soon/research", label: "Research", later: true },
    { href: "/app/about", label: "Our mission & impact" },
  ] },
];

// create/edit screens: dive flow, completed sessions, training sessions
export function isFormRoute(pathname: string) {
  return /^\/app\/(log\/new|log\/[^/]+\/edit|log\/sessions\/[^/]+|train\/[^/]+)$/.test(pathname);
}

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}
