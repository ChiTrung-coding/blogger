import config from '../../posts/_config.json';

const OVERRIDES_KEY = 'blogger-config-overrides';
const CONFIG_EVENT = 'blogger-config-updated';

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function mergeConfig(base, overrides) {
  if (!isObject(base) || !isObject(overrides)) return overrides ?? base;
  return Object.keys({ ...base, ...overrides }).reduce((result, key) => {
    result[key] = isObject(base[key]) && isObject(overrides[key])
      ? mergeConfig(base[key], overrides[key])
      : overrides[key] ?? base[key];
    return result;
  }, {});
}

export function getConfigOverrides() {
  try {
    return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveConfigOverrides(overrides) {
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  window.dispatchEvent(new Event(CONFIG_EVENT));
}

export function clearConfigOverrides() {
  localStorage.removeItem(OVERRIDES_KEY);
  window.dispatchEvent(new Event(CONFIG_EVENT));
}

export function getConfigEventName() {
  return CONFIG_EVENT;
}

/**
 * Returns the full site configuration object.
 * @returns {Object} The complete config from posts/_config.json
 */
export function getConfig() {
  return mergeConfig(config, getConfigOverrides());
}

/**
 * Returns the base site URL from config.
 * @returns {string} The site URL (e.g. "https://username.github.io/blogger")
 */
export function getSiteUrl() {
  return config.site.url;
}
