import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EmailService } from './services/email.service';

@Module({
    imports: [
        // Email
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                transport: {
                    service: config.get('notification.email.service'),
                    auth: {
                        user: config.get('notification.email.email'),
                        pass: config.get('notification.email.password')
                    },
                },
                defaults: {
                    from: {
                        name: config.get('notification.email.name'),
                        address: config.get('notification.email.email')
                    },
                },
                template: {
                    dir: join(__dirname, 'notification/templates'),
                    adapter: new EjsAdapter(),
                    options: {
                        strict: true,
                    },
                },
                preview: false
            }),
            inject: [ConfigService]
        }),
    ],
    controllers: [],
    providers: [EmailService],
    exports: [EmailService]
})
export class NotificationModule {}