import { User } from "@app/user/decorators/user.decorator";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { UserEntity } from "@app/user/user.entity";
import { Body, Controller, Delete, Get, Post, Put, UseGuards } from "@nestjs/common";
import { CreateQueueDto } from "./dto/createQueue.dto";
import { DeleteQueueDto } from "./dto/deleteQueue.dto";
import { EditQueueDto } from "./dto/editQueue.dto";
import { QueueEntity } from "./queue.entity";
import { QueueService } from "./queue.service";

@Controller('queue')
export class QueueController {
    constructor(
        private readonly queueService: QueueService
    ) {}

    @Post('create')
    @UseGuards(AuthGuard)
    async createQueue(
        @User() currentUser: UserEntity,
        @Body() createQueueDto: CreateQueueDto
    ): Promise<QueueEntity> {
        const queue = await this.queueService.createQueue(currentUser, createQueueDto);
        return queue;
    }

    @Put('edit')
    @UseGuards(AuthGuard)
    async editQueue(
        @User() currentUser: UserEntity,
        @Body() editQueueDto: EditQueueDto
    ): Promise<QueueEntity> {
        const queue = await this.queueService.editQueue(currentUser, editQueueDto);
        return queue;
    }

    @Delete('delete')
    @UseGuards(AuthGuard)
    async deleteQueue(
        @User() currentUser: UserEntity,
        @Body() deleteQueueDto: DeleteQueueDto
    ): Promise<QueueEntity> {
        const queue = await this.queueService.deleteQueue(currentUser, deleteQueueDto);
        return queue;
    }

    @Get('get')
    @UseGuards(AuthGuard)
    async getQueues(
        @User() currentUser: UserEntity,
    ): Promise<QueueEntity[]> {
        const queues = await this.queueService.getQueues(currentUser);
        return queues;
    }
}