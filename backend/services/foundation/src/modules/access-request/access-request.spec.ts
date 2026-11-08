import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AccessRequestRateLimitedError, AccessRequestService } from './access-request.service';
import { CreateAccessRequestDto } from './dto/access-request.dto';

const valid = {
  organisationName: '  Asha Cancer Centre ',
  organisationType: 'cancer_centre',
  contactName: 'Asha Rao',
  email: ' Asha@Example.COM ',
  phone: '+91 98765 43210',
  country: 'India',
  facilityCount: '2',
  bedCount: 120,
  modules: ['oncology', 'billing', 'oncology'],
  message: 'We run two centres.',
  consent: true,
};

function toDto(input: Record<string, unknown>) {
  const dto = plainToInstance(CreateAccessRequestDto, input, { enableImplicitConversion: true });
  return { dto, errors: validateSync(dto, { whitelist: true, forbidNonWhitelisted: true }) };
}

function fakePrisma() {
  const rows: any[] = [];
  return {
    rows,
    client: {
      accessRequest: {
        create: async ({ data }: any) => {
          const row = { id: `r${rows.length + 1}`, status: 'new', ...data };
          rows.push(row);
          return { id: row.id };
        },
        findMany: async () => rows,
        groupBy: async () => [{ status: 'new', _count: { _all: rows.length } }],
      },
    } as any,
  };
}

describe('CreateAccessRequestDto', () => {
  it('accepts a complete request and normalises it', () => {
    const { dto, errors } = toDto(valid);
    expect(errors).toHaveLength(0);
    expect(dto.organisationName).toBe('Asha Cancer Centre');
    expect(dto.email).toBe('asha@example.com');
    expect(dto.facilityCount).toBe(2);
  });

  it('requires consent, a valid email and known modules', () => {
    expect(toDto({ ...valid, consent: false }).errors.map((e) => e.property)).toContain('consent');
    expect(toDto({ ...valid, email: 'not-an-email' }).errors.map((e) => e.property)).toContain('email');
    expect(toDto({ ...valid, modules: ['crypto'] }).errors.map((e) => e.property)).toContain('modules');
    expect(toDto({ ...valid, organisationType: 'casino' }).errors.map((e) => e.property)).toContain('organisationType');
  });

  it('rejects unknown fields', () => {
    expect(toDto({ ...valid, status: 'approved' }).errors.map((e) => e.property)).toContain('status');
  });
});

describe('AccessRequestService', () => {
  it('stores a request with modules de-duplicated', async () => {
    const { client, rows } = fakePrisma();
    const service = new AccessRequestService(client);
    await expect(service.submit(toDto(valid).dto, '1.1.1.1')).resolves.toBe(true);
    expect(rows[0]).toMatchObject({ email: 'asha@example.com', modules: ['oncology', 'billing'] });
  });

  it('silently drops honeypot submissions', async () => {
    const { client, rows } = fakePrisma();
    const service = new AccessRequestService(client);
    await expect(service.submit(toDto({ ...valid, website: 'http://spam' }).dto, '1.1.1.1')).resolves.toBe(false);
    expect(rows).toHaveLength(0);
  });

  it('limits requests per IP and per email', async () => {
    const { client } = fakePrisma();
    const service = new AccessRequestService(client);
    for (let i = 0; i < 3; i++) {
      await service.submit(toDto({ ...valid }).dto, `10.0.0.${i}`);
    }
    await expect(service.submit(toDto({ ...valid }).dto, '10.0.0.9')).rejects.toBeInstanceOf(AccessRequestRateLimitedError);

    for (let i = 0; i < 5; i++) {
      await service.submit(toDto({ ...valid, email: `p${i}@example.com` }).dto, '2.2.2.2');
    }
    await expect(service.submit(toDto({ ...valid, email: 'p9@example.com' }).dto, '2.2.2.2')).rejects.toBeInstanceOf(
      AccessRequestRateLimitedError,
    );
  });

  it('returns counts for every status', async () => {
    const { client } = fakePrisma();
    const service = new AccessRequestService(client);
    await service.submit(toDto(valid).dto, '3.3.3.3');
    const result = await service.list();
    expect(result.counts).toEqual({ new: 1, contacted: 0, approved: 0, declined: 0 });
  });
});
