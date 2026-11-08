import { parseDeploymentMode, parseEmailLoginMode } from '@/lib/config/deployment';

describe('parseEmailLoginMode', () => {
  it('collapses email sign-in on the demo by default', () => {
    expect(parseEmailLoginMode(undefined, 'demo')).toBe('collapsed');
    for (const mode of ['development', 'staging', 'production'] as const) {
      expect(parseEmailLoginMode(undefined, mode)).toBe('visible');
    }
  });

  it('honours an explicit setting in any mode', () => {
    expect(parseEmailLoginMode('visible', 'demo')).toBe('visible');
    expect(parseEmailLoginMode(' Collapsed ', 'production')).toBe('collapsed');
    expect(parseEmailLoginMode('bogus', 'demo')).toBe('collapsed');
  });
});

describe('parseDeploymentMode', () => {
  it('maps aliases and falls back by NODE_ENV', () => {
    expect(parseDeploymentMode('sandbox', 'production')).toBe('demo');
    expect(parseDeploymentMode(undefined, 'production')).toBe('production');
    expect(parseDeploymentMode(undefined, 'development')).toBe('development');
  });
});
