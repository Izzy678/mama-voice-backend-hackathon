import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { envEnum } from '../../utils/enum/env.enum';
import { SendEmailOptions } from '../interface/send-email.interface';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly apiKey: string;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>(envEnum.RESEND_API_KEY)!;
    this.from =
      this.configService.get<string>(envEnum.EMAIL_FROM) ??
      'MamaVoice <onboarding@resend.dev>';
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    if (!this.apiKey) {
      throw new InternalServerErrorException('RESEND_API_KEY is not set');
    }

    const resend = new Resend(this.apiKey);
    const { error } = await resend.emails.send({
      from: this.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
