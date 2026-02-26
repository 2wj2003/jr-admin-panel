export const getApiUrl = () => {

  if (process.env.NODE_ENV === 'production' && process.env.IS_CI !== 'true') {
    if (typeof window === 'undefined') {
      // return 'http://api-service.local:3000';
    } else {
      return 'https://api.jr.co.th';
    }
  }

  return 'http://localhost:1337';

  // return 'https://api.jr.co.th';
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
