import { readMailSettings, MailService } from './mail.service';

describe('readMailSettings', () => {
  it('is configured only with host, user and password', () => {
    expect(readMailSettings({}).configured).toBe(false);
    expect(readMailSettings({ SMTP_HOST: 'smtp.gmail.com', SMTP_USER: 'a@gmail.com' }).configured).toBe(false);
    const gmail = readMailSettings({ SMTP_HOST: 'smtp.gmail.com', SMTP_USER: 'a@gmail.com', SMTP_PASS: 'abcd efgh ijkl mnop' });
    expect(gmail).toMatchObject({ configured: true, port: 465, secure: true, pass: 'abcdefghijklmnop', from: 'Athma <a@gmail.com>' });
  });

  it('uses STARTTLS on 587 unless told otherwise', () => {
    expect(readMailSettings({ SMTP_HOST: 'h', SMTP_USER: 'u', SMTP_PASS: 'p', SMTP_PORT: '587' }).secure).toBe(false);
  });
});

describe('MailService', () => {
  it('skips sending when not configured', async () => {
    const saved = { ...process.env };
    delete process.env.SMTP_HOST;
    const service = new MailService();
    await expect(service.send({ to: ['x@example.com'], subject: 's', text: 't' })).resolves.toBe(false);
    process.env = saved;
  });
});
