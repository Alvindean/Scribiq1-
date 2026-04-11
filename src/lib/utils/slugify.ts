export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function uniqueSlug(base: string): string {
  const slug = slugify(base);
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${slug}-${suffix}`;
}
