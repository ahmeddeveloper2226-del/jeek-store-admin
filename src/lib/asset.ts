/**
 * Resolves root-relative asset paths (e.g. "/src/assets/images/x.jpg") against the
 * Vite base URL so the site also works when hosted in a sub-folder
 * (e.g. https://user.github.io/repo/). Data URLs and absolute URLs are untouched.
 */
export function asset(path: string | undefined | null): string {
  if (!path) return '';
  if (/^(data:|blob:|https?:)?\/\//.test(path) || /^(data:|blob:|https?:)/.test(path)) return path;
  if (path.startsWith('/')) return import.meta.env.BASE_URL + path.slice(1);
  return path;
}
