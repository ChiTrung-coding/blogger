import bundledConfig from '../../posts/_config.json';

const OVERRIDES_KEY = 'blogger-config-overrides';
const CONFIG_EVENT = 'blogger-config-updated';

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function cloneConfig(value) {
  return JSON.parse(JSON.stringify(value));
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

function discardLegacyBrowserConfig() {
  try {
    localStorage.removeItem(OVERRIDES_KEY);
  } catch {
    // localStorage may be unavailable
  }
}

discardLegacyBrowserConfig();

let runtimeConfig = cloneConfig(bundledConfig);

function notifyConfigUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CONFIG_EVENT));
  }
}

if (import.meta.hot) {
  import.meta.hot.accept('../../posts/_config.json', (mod) => {
    if (!mod?.default) return;
    runtimeConfig = cloneConfig(mod.default);
    notifyConfigUpdated();
  });
}

async function writeConfigFile(nextConfig) {
  try {
    const response = await fetch('/__save-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextConfig),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export function getConfigEventName() {
  return CONFIG_EVENT;
}

/**
 * Returns the live site configuration.
 * Source of truth is posts/_config.json. Browser-local overrides are ignored
 * so every device shows the same deployed data.
 */
export function getConfig() {
  return runtimeConfig;
}

export function getSiteUrl() {
  return bundledConfig.site.url;
}

export async function persistConfig(patch) {
  runtimeConfig = mergeConfig(cloneConfig(runtimeConfig), patch);
  notifyConfigUpdated();
  const savedToDisk = await writeConfigFile(runtimeConfig);
  return { savedToDisk };
}

export async function clearConfigOverrides() {
  runtimeConfig = cloneConfig(bundledConfig);
  notifyConfigUpdated();
  return { savedToDisk: false };
}
