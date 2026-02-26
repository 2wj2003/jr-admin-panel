import { getApiUrl } from "./get-url";

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData) {
  const url = `${getApiUrl()}/api/contact-forms`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error?.message || "Failed to submit contact form");
  }

  return response.json();
}
