import { useEffect, useState } from 'react';
import { getConfig, getConfigEventName } from '../lib/config.js';

/**
 * Hook để lấy cấu hình site từ posts/_config.json.
 * Mọi thiết bị đọc cùng file này; không dùng localStorage làm nguồn dữ liệu.
 *
 * @returns {Object} Config object đầy đủ
 */
export function useConfig() {
  const [config, setConfig] = useState(getConfig);

  useEffect(() => {
    const refresh = () => setConfig(getConfig());
    window.addEventListener(getConfigEventName(), refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(getConfigEventName(), refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return config;
}
