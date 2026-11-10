import { of } from 'rxjs';
import { MedicalCodingService } from './medical-coding.service';

function setup(encounterSearchIds: string[] = []) {
  const prisma = {
    codingSession: {
      findMany: jest.fn().mockResolvedValue([{ id: 's1', encounterId: 'e1' }]),
      count: jest.fn().mockResolvedValue(57),
    },
  };
  const httpService = {
    get: jest.fn((url: string) =>
      url.endsWith('/encounters')
        ? of({ data: { data: encounterSearchIds.map((id) => ({ id })) } })
        : of({ data: { id: 'e1', patientId: 'p1', patientDisplay: { displayName: 'Asha Rao' } } }),
    ),
  };
  const service = new MedicalCodingService(prisma as any, httpService as any);
  return { service, prisma, httpService };
}

describe('MedicalCodingService.findAllSessions', () => {
  it('returns one page plus the total matching the filters, tenant-scoped', async () => {
    const { service, prisma } = setup();
    const result = await service.findAllSessions('t1', { status: 'completed' as any, limit: 20, offset: 40 });

    expect(result.total).toBe(57);
    expect(result.sessions).toHaveLength(1);
    expect(result.sessions[0]).toMatchObject({ id: 's1', patientId: 'p1' });
    const args = prisma.codingSession.findMany.mock.calls[0][0];
    expect(args.where).toEqual({ tenantId: 't1', status: 'completed' });
    expect(args.take).toBe(20);
    expect(args.skip).toBe(40);
    expect(prisma.codingSession.count).toHaveBeenCalledWith({ where: args.where });
  });

  it('clamps the page size and defaults to 100', async () => {
    const { service, prisma } = setup();
    await service.findAllSessions('t1', { limit: 10_000 });
    await service.findAllSessions('t1', {});
    expect(prisma.codingSession.findMany.mock.calls[0][0].take).toBe(200);
    expect(prisma.codingSession.findMany.mock.calls[1][0].take).toBe(100);
  });

  it('searches patient name through Clinical encounters and the claim number', async () => {
    const { service, prisma } = setup(['e7', 'e9']);
    await service.findAllSessions('t1', { search: 'rao' });
    const where = prisma.codingSession.findMany.mock.calls[0][0].where;
    expect(where.tenantId).toBe('t1');
    expect(where.OR).toEqual([
      { claim: { claimNumber: { contains: 'rao', mode: 'insensitive' } } },
      { encounterId: { in: ['e7', 'e9'] } },
    ]);
  });
});
