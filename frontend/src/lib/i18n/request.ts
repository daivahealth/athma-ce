import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Provide a default locale if none is provided
  const currentLocale = locale || 'en';
  
  return {
    locale: currentLocale,
    messages: (await import(`./messages/${currentLocale}.json`).catch(() => import('./messages/en.json')))
      .default,
  };
});
