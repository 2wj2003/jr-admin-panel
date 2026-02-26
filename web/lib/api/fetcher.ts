export const fetcher = <T>(url: string): Promise<T> =>
  fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    next: { revalidate: 60 }
  }).then((res) => res.json());
