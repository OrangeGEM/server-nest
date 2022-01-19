import { UserEntity } from "@app/user/user.entity";
import { HttpCode, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateQueueDto } from "./dto/createQueue.dto";
import { DeleteQueueDto } from "./dto/deleteQueue.dto";
import { EditQueueDto } from "./dto/editQueue.dto";
import { QueueEntity } from "./queue.entity";

@Injectable()
export class QueueService {
    constructor(
        @InjectRepository(QueueEntity)
        private readonly queueRepository: Repository<QueueEntity>
    ) {}
    
    //Create queue
    async createQueue(currentUser: UserEntity, createQueueDto: CreateQueueDto): Promise<QueueEntity> {
        const queueByKeyword = await this.findByParams({
            keyword: createQueueDto.keyword
        })

        if(queueByKeyword) {
            throw new HttpException('Keyword are taken', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const queue = new QueueEntity();
        Object.assign(queue, createQueueDto);
        queue.owner = currentUser;

        return await this.queueRepository.save(queue);
    }

    //Edit queue
    async editQueue(currentUser: UserEntity, editQueueDto: EditQueueDto): Promise<QueueEntity> {
        const queueByKeyword = await this.findByParams({
            keyword: editQueueDto.keyword
        })

        if(queueByKeyword) {
            throw new HttpException('Keyword are taken', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const queue = await this.findById(editQueueDto.id);
        Object.assign(queue, editQueueDto);

        return await this.queueRepository.save(queue);
    }

    //Delete queue
    async deleteQueue(currentUser: UserEntity, deleteQueueDto: DeleteQueueDto): Promise<QueueEntity> {
        const queue = await this.findById(deleteQueueDto.id);
        
        if(!queue.isActive) {
            throw new HttpException('Queue already deleted', HttpStatus.BAD_REQUEST)
        }

        return await this.queueRepository.save(queue);
    }

    async getQueues(currentUser: UserEntity): Promise<QueueEntity[]> {
        const queues = await this.queueRepository.find({
            owner: currentUser,
            isActive: true,
        })
        return queues;
    }


    findById(id: number, options?): Promise<QueueEntity> {
        return this.queueRepository.findOne(id, options);
    }

    findByParams(params?): Promise<QueueEntity> {
        return this.queueRepository.findOne(params)
    }
}