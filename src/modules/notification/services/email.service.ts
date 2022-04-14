import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService
    ) {}

    // Add logger
    private readonly logger = new Logger(EmailService.name);

    /**
     * For example usage see : https://github.com/yanarp/nestjs-mailer/blob/master/src/app.service.ts
     * @param option ISendMailOptions
     * @returns [boolean, string]
     */
    async send(
        option: ISendMailOptions
    ): Promise<[boolean, string]> {
        try {
            await this.mailerService.sendMail({
                ...option,
            });
            return [true, null]
        } catch(e) {
            this.logger.error(e);
            return [false, `${EmailService.name}: ${(e as Error).message}`];
        }
    }
}