import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from "@app/config";
import { UserEntity } from "@app/user/user.entity";

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    public async sendActivatedLink(user: UserEntity) : Promise<void> {
        this.mailerService.sendMail({
            to: user.email,
            from: 'Orange-temp@yandex.ru',
            subject: 'Activate account',
            text: 'Activate account',
            html: `<a> Activated link: ${await this.generateActivatedLink(user)} </a>`
        })
        console.log(`Mail send to ${user.email}`);
    }

    public async sendUpdatePasswordLink(user: UserEntity) : Promise<void> {
        this.mailerService.sendMail({
            to: user.email,
            from: 'Orange-temp@yandex.ru',
            subject: 'Refresh password',
            text: 'Refresh passwordt',
            html: `<a> Refresh password link: ${await this.generateRefreshPasswordLink(user)} </a>`
        })
        console.log(`Mail send to ${user.email}`);
    }

    private async generateActivatedLink(user: UserEntity): Promise<string> {
        return `http://localhost:3000/activate/${this.generateUniquePart(user)}`
    }

    private async generateRefreshPasswordLink(user: UserEntity): Promise<string> {
        return `http://localhost:3000/update-nonauth-password/${this.generateUniquePart(user)}`
    }

    private generateUniquePart(user: UserEntity): string {
        return sign({
            id: user.id,
            email: user.email
        }, JWT_SECRET);
    }
}