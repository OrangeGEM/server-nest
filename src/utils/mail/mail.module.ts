import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
      MailerModule.forRoot({
      transport: 'smtps://Orange-temp@yandex.ru:vmedkgbgjenroclp@smtp.yandex.ru',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    })
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}