const ADMIN_KEY = 'blogger-admin-data';
const ADMIN_EVENT = 'blogger-admin-updated';

const emptyData = {
  posts: [],
  deletedPosts: [],
};

export function getAdminData() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ADMIN_KEY) || '{}');
    return { ...emptyData, ...parsed };
  } catch {
    return { ...emptyData };
  }
}

export function saveAdminData(data) {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(ADMIN_EVENT));
}

export function getAdminEventName() {
  return ADMIN_EVENT;
}

export function clearAdminData() {
  localStorage.removeItem(ADMIN_KEY);
  window.dispatchEvent(new Event(ADMIN_EVENT));
}
