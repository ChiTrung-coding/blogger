import { describe, expect, it } from 'vitest';
import { searchPosts } from '../../src/lib/search.js';

describe('search properties', () => {
  it('returns no results for short or blank keywords', () => {
    for (const keyword of ['', ' ', 'a', '  a  ']) {
      expect(searchPosts(keyword)).toEqual([]);
    }
  });

  it('never returns more than twenty results', () => {
    expect(searchPosts('react').length).toBeLessThanOrEqual(20);
  });
});
