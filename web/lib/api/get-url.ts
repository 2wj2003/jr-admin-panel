export const getApiUrl = () => {
  // Use environment variable if available
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Production fallback
  if (process.env.NODE_ENV === 'production') {
    return 'https://api.jr.co.th';
  }

  // Development fallback
  return 'http://localhost:1337';
};


export const getMeiliUrl = () => {
  if (process.env.NODE_ENV === 'production' && process.env.IS_CI !== 'true') {
    if (typeof window === 'undefined') {
      // return 'http://meilisearch-service.local:7700';
    } else {
      return 'https://ms-57c49e397bd3-1249.sgp.meilisearch.io';
    }
  }

  // return 'http://localhost:7700';

  return 'https://ms-57c49e397bd3-1249.sgp.meilisearch.io';
};
