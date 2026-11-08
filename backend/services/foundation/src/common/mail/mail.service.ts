import { Injectable, Logger } from '@nestjs/common';

/**
 * Outgoing email over SMTP (nodemailer). Optional: when SMTP_HOST, SMTP_USER
 * and SMTP_PASS are not all set, sending is a logged no-op, so local
 * development and instances without email keep working.
 *
 * For Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=465, SMTP_USER=<gmail
 * address>, SMTP_PASS=<16-character Google app password>. See
 * docs/runbooks/demo-environment-gcp.md (Email alerts).
 */

interface MailTransport {
  sendMail(message: { from: string; to: string; subject: string; text: string; replyTo?: string }): Promise<unknown>;
}

// nodemailer ships no TypeScript types; this is the slice we use.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer') as {
  createTransport(options: {
    host: string;
    port: number;
    secure: boolean;
    auth: { user: string; pass: string };
  }): MailTransport;
};

export interface MailMessage {
  to: string[];
  subject: string;
  text: string;
  replyTo?: string;
}

export function readMailSettings(env: NodeJS.ProcessEnv = process.env) {
  const host = env.SMTP_HOST?.trim();
  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASS?.replace(/\s+/g, '');
  const port = Number(env.SMTP_PORT ?? 465) || 465;
  return {
    configured: !!(host && user && pass),
    host: host ?? '',
    user: user ?? '',
    pass: pass ?? '',
    port,
    secure: env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465,
    from: env.MAIL_FROM?.trim() || (user ? `Athma <${user}>` : ''),
  };
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly settings = readMailSettings();
  private transport: MailTransport | null = null;

  isConfigured(): boolean {
    return this.settings.configured;
  }

  /** Sends a plain-text email. Never throws: failures are logged, so callers' own work is not affected. */
  async send(message: MailMessage): Promise<boolean> {
    if (!this.settings.configured) {
      this.logger.debug(`Email not configured; skipped "${message.subject}"`);
      return false;
    }
    if (message.to.length === 0) return false;
    try {
      this.transport ??= nodemailer.createTransport({
        host: this.settings.host,
        port: this.settings.port,
        secure: this.settings.secure,
        auth: { user: this.settings.user, pass: this.settings.pass },
      });
      await this.transport.sendMail({
        from: this.settings.from,
        to: message.to.join(', '),
        subject: message.subject,
        text: message.text,
        ...(message.replyTo ? { replyTo: message.replyTo } : {}),
      });
      return true;
    } catch (error) {
      this.logger.warn(`Email "${message.subject}" failed: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }
}
