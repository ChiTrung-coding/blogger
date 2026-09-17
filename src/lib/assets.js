export function resolveAssetUrl(value) {
  if (!value || value.startsWith('data:') || value.startsWith('http://') || value.startsWith('https://') || value.startsWith('//')) {
    return value;
  }
  const base = import.meta.env.BASE_URL || '/';
  const normalized = value.replace(/^\/+/, '');
  return `${base}${normalized}`.replace(/([^:]\/)\/+/, '$1');
}
