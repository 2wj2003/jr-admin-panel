import { getApiUrl } from './get-url';

export const ezforms = (data: any) => {
  const url = getApiUrl() + '/api/ezforms/submit';

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({ formData: data })
  });
};
