import { getCategoryIcon } from "@/lib/constants";

export function CategoryIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  // CATEGORY_ICONS is a module-level static map (see lib/constants.ts) — the
  // lookup returns a stable component, not one created during render.
  const Icon = getCategoryIcon(slug);
  // eslint-disable-next-line react-hooks/static-components
  return <Icon className={className} />;
}