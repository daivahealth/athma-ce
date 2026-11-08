import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateSandboxDto } from './dto/sandbox.dto';
import { readSandboxSettings, resolveModules, SANDBOX_DEFAULT_MODULES, SANDBOX_MODULE_FLAGS, SANDBOX_MODULES } from './sandbox.settings';

function errorsFor(input: Record<string, unknown>) {
  const dto = plainToInstance(CreateSandboxDto, input);
  return validateSync(dto, { whitelist: true, forbidNonWhitelisted: true }).map((e) => e.property);
}

describe('sandbox settings', () => {
  it('is off unless enabled, and not ready unless both access switches are on', () => {
    expect(readSandboxSettings({}).enabled).toBe(false);
    const on = { SANDBOX_ENABLED: 'true', AUTH_REQUIRE_TOKEN_FOR_WRITES: 'true' } as NodeJS.ProcessEnv;
    expect(readSandboxSettings({ ...on, AUTH_REQUIRE_TOKEN_FOR_READS: 'report' }).isolationReady).toBe(false);
    expect(readSandboxSettings({ ...on, AUTH_REQUIRE_TOKEN_FOR_READS: 'true' }).isolationReady).toBe(true);
  });

  it('defaults to 50 sandboxes for 30 days', () => {
    const settings = readSandboxSettings({});
    expect(settings).toMatchObject({ maxActive: 50, lifetimeDays: 30, extensionDays: 30, maxCreatesPerOwnerPerDay: 3 });
    expect(readSandboxSettings({ SANDBOX_MAX_ACTIVE: '5', SANDBOX_LIFETIME_DAYS: 'x' })).toMatchObject({ maxActive: 5, lifetimeDays: 30 });
  });

  it('picks modules from the organisation type unless given', () => {
    expect(resolveModules('clinic')).toEqual(SANDBOX_DEFAULT_MODULES.clinic);
    expect(resolveModules('clinic')).not.toContain('inpatient');
    expect(resolveModules('cancer_centre')).toEqual([...SANDBOX_MODULES]);
    expect(resolveModules('hospital', ['oncology', 'lab', 'inpatient', 'oncology'])).toEqual(['inpatient', 'oncology']);
    expect(resolveModules('hospital', [])).toEqual([]);
  });

  it('maps every module to a navigation switch', () => {
    for (const module of SANDBOX_MODULES) expect(SANDBOX_MODULE_FLAGS[module]).toMatch(/^feature\.nav\./);
  });
});

describe('CreateSandboxDto', () => {
  const valid = { organisationName: '  Asha   Clinic ', organisationType: 'clinic', acknowledged: true };

  it('accepts a request and normalises the name', () => {
    expect(errorsFor(valid)).toEqual([]);
    expect(plainToInstance(CreateSandboxDto, valid).organisationName).toBe('Asha Clinic');
  });

  it('requires the acknowledgement, a known type and known modules', () => {
    expect(errorsFor({ ...valid, acknowledged: false })).toContain('acknowledged');
    expect(errorsFor({ ...valid, organisationType: 'casino' })).toContain('organisationType');
    expect(errorsFor({ ...valid, modules: ['crypto'] })).toContain('modules');
    expect(errorsFor({ ...valid, tenantId: 'x' })).toContain('tenantId');
  });
});
