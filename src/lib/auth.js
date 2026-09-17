import config from '../../posts/_config.json';

const SESSION_KEY = 'blogger-admin-session';
const ATTEMPTS_KEY = 'blogger-admin-login-attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function getCredentials() {
  return config.adminAuth || { username: 'admin', password: 'change-me' };
}

function getAttempts() {
  try {
    return JSON.parse(localStorage.getItem(ATTEMPTS_KEY) || '{"count":0,"lockedUntil":0}');
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
}

function setAttempts(attempts) {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
}

export function getLockoutRemaining() {
  const { lockedUntil } = getAttempts();
  return Math.max(0, lockedUntil - Date.now());
}

export function isAdminAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === 'authenticated';
}

export function loginAdmin(username, password) {
  const attempts = getAttempts();
  const remaining = getLockoutRemaining();
  if (remaining > 0) return { ok: false, locked: true, remaining };

  const credentials = getCredentials();
  if (username === credentials.username && password === credentials.password) {
    setAttempts({ count: 0, lockedUntil: 0 });
    sessionStorage.setItem(SESSION_KEY, 'authenticated');
    return { ok: true };
  }

  const count = attempts.count + 1;
  const lockedUntil = count >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0;
  setAttempts({ count, lockedUntil });
  return {
    ok: false,
    locked: Boolean(lockedUntil),
    remaining: lockedUntil ? LOCKOUT_MS : 0,
    attemptsLeft: Math.max(0, MAX_ATTEMPTS - count),
  };
}

export function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getAdminUsername() {
  return getCredentials().username;
}
