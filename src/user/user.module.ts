import { MailModule } from "@app/utils/mail/mail.module";
import { MailService } from "@app/utils/mail/mail.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard } from "./guards/auth.guard";
import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";

@Module({
    controllers: [UserController],
    providers: [UserService, AuthGuard],
    imports: [TypeOrmModule.forFeature([UserEntity]), MailModule],
    exports: [UserService],
})
export class UserModule {}