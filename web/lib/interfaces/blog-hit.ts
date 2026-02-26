import { BaseHit } from 'instantsearch.js';

export interface BlogHit extends BaseHit {
  id: string;

  slug: string
  title: string;

  description: string

  publishedAt: string;

  coverImage?: {
    url: string;
    alternativeText: string;
  };
}
