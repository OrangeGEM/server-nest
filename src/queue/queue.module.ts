import { UserService } from "@app/user/user.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QueueController } from "./queue.controller";
import { QueueEntity } from "./queue.entity";
import { QueueService } from "./queue.service";

@Module({
    controllers: [QueueController],
    providers: [QueueService],
    imports: [TypeOrmModule.forFeature([QueueEntity])],
    exports: [QueueService],
})
export class QueueModule {}