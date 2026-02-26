import { getApiUrl } from './get-url';

const leadMessage = (name: string, tel: string) => {
  return `มีลูกค้าติดต่อเข้ามา\n-------------------\nชื่อ: ${name}\nโทร: ${tel}`;
};

export const lineNotify = (name: string, tel: string) => {
  const url = getApiUrl() + '/api/line-notify';

  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: leadMessage(name, tel)
    })
  });
};
