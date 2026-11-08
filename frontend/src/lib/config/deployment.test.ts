import { parseDeploymentMode, parseEmailLoginMode, parseLandingPage } from '@/lib/config/deployment';

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

describe('parseLandingPage', () => {
  it('is on for the demo and off elsewhere by default', () => {
    expect(parseLandingPage(undefined, 'demo')).toBe(true);
    expect(parseLandingPage(undefined, 'production')).toBe(false);
    expect(parseLandingPage(undefined, 'development')).toBe(false);
  });

  it('honours an explicit setting', () => {
    expect(parseLandingPage('on', 'production')).toBe(true);
    expect(parseLandingPage('off', 'demo')).toBe(false);
  });
});
