/**
 * Next.js Instrumentation
 *
 * This file is automatically loaded by Next.js when the experimental
 * instrumentationHook is enabled in next.config.js.
 *
 * It initializes OpenTelemetry for server-side tracing.
 */

export async function register() {
  // Only initialize in server environment and when enabled
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED === 'true'
  ) {
    const { registerOTel } = await import('@vercel/otel');

    registerOTel({
      serviceName: process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME || 'zeal-frontend',
      attributes: {
        'deployment.environment': process.env.NODE_ENV || 'development',
        'service.namespace': 'zeal',
        'service.version': process.env.npm_package_version || '0.0.0',
      },
    });

    console.log('[Observability] Frontend instrumentation initialized');
  }
}
