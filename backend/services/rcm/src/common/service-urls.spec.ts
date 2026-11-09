import { apiBaseUrl, resolveClinicalApiUrl, resolveClinicalServiceApiUrl, resolveFoundationApiUrl } from './service-urls';

describe('apiBaseUrl', () => {
  it('appends /api/v1 to a bare origin', () => {
    expect(apiBaseUrl('http://clinical:3011', 'x')).toBe('http://clinical:3011/api/v1');
    expect(apiBaseUrl('http://clinical:3011/', 'x')).toBe('http://clinical:3011/api/v1');
  });

  it('keeps a URL that already has a path', () => {
    expect(apiBaseUrl('http://localhost:3011/api/v1', 'x')).toBe('http://localhost:3011/api/v1');
    expect(apiBaseUrl('http://localhost:3011/api/v1/', 'x')).toBe('http://localhost:3011/api/v1');
    expect(apiBaseUrl('https://gw.example.com/clinical/api/v1', 'x')).toBe(
      'https://gw.example.com/clinical/api/v1',
    );
  });

  it('uses the fallback when the value is empty or unset', () => {
    expect(apiBaseUrl(undefined, 'http://localhost:3011')).toBe('http://localhost:3011/api/v1');
    expect(apiBaseUrl('  ', 'http://localhost:3011')).toBe('http://localhost:3011/api/v1');
  });

  it('returns an unparseable value unchanged', () => {
    expect(apiBaseUrl('clinical:3011', 'x')).toBe('clinical:3011');
  });
});

describe('service URL readers', () => {
  it('resolve the demo compose values to /api/v1', () => {
    const env = {
      CLINICAL_API_URL: 'http://clinical:3011',
      CLINICAL_SERVICE_URL: 'http://clinical:3011',
      FOUNDATION_API_URL: 'http://foundation:3010/api/v1',
    };
    expect(resolveClinicalApiUrl(env)).toBe('http://clinical:3011/api/v1');
    expect(resolveClinicalServiceApiUrl(env)).toBe('http://clinical:3011/api/v1');
    expect(resolveFoundationApiUrl(env)).toBe('http://foundation:3010/api/v1');
  });

  it('keep the local defaults', () => {
    expect(resolveClinicalApiUrl({})).toBe('http://localhost:3011/api/v1');
    expect(resolveClinicalServiceApiUrl({})).toBe('http://localhost:3011/api/v1');
    expect(resolveFoundationApiUrl({})).toBe('http://localhost:3010/api/v1');
  });
});
