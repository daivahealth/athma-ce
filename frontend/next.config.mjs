import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "connect-src 'self' http://localhost:* https://*",
      "frame-ancestors 'none'",
      "form-action 'self'"
    ].join('; '),
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self)',
  },
];

const nextConfig = {
  reactStrictMode: true,
  // OpenTelemetry instrumentation is loaded from src/instrumentation.ts.
  // The hook is stable since Next 15, so no experimental flag is needed; the
  // register() body self-gates on NEXT_PUBLIC_OBSERVABILITY_ENABLED.
  headers: async () => [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ],
};

export default withNextIntl(nextConfig);
