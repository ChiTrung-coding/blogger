const ADMIN_KEY = 'blogger-admin-data';
const ADMIN_EVENT = 'blogger-admin-updated';

const emptyData = {
  posts: [],
  deletedPosts: [],
};

let memory = { ...emptyData };

function discardLegacyAdminData() {
  try {
    localStorage.removeItem(ADMIN_KEY);
  } catch {
    // localStorage may be unavailable
  }
}

discardLegacyAdminData();

export function getAdminData() {
  return {
    posts: [...memory.posts],
    deletedPosts: [...memory.deletedPosts],
  };
}

export function saveAdminData(data) {
  memory = {
    posts: data.posts || [],
    deletedPosts: data.deletedPosts || [],
  };
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ADMIN_EVENT));
  }
}

export function getAdminEventName() {
  return ADMIN_EVENT;
}

export function clearAdminData() {
  memory = { ...emptyData };
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ADMIN_EVENT));
  }
}

export async function writePostFile(post) {
  const frontmatter = {
    title: post.title,
    slug: post.slug,
    date: post.date,
    category: post.category,
    tags: post.tags,
    excerpt: post.excerpt,
    thumbnail: post.thumbnail || null,
    published: post.published,
  };
  const markdown = `---\n${Object.entries(frontmatter).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\n\n${post.content}`;
  try {
    const response = await fetch('/__save-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: post.slug, date: post.date, markdown }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function deletePostFile(slug) {
  try {
    const response = await fetch('/__delete-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
