import { QueueEntity } from "@app/queue/queue.entity";
import { UserEntity } from "@app/user/user.entity";
import { HttpCode, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateMemberDto } from "./dto/createMember.dto";
import { EditMemberDto } from "./dto/editMember.dto";
import { MemberEntity } from "./member.entity";

@Injectable()
export class MemberService {
    constructor(
        @InjectRepository(MemberEntity)
        private readonly memberRepository: Repository<MemberEntity>,

        @InjectRepository(QueueEntity)
        private readonly queueRepository: Repository<QueueEntity>,
    ) {}

    //Create member
    async createMember(createMemberDto: CreateMemberDto, queueId: number, user: UserEntity): Promise<MemberEntity> {
        const queue = await this.searchQueueFromUser(queueId, user);

        const member = new MemberEntity();
        Object.assign(member, createMemberDto);

        queue.ticketNumber++;
        member.ticket = 'A'+(queue.ticketNumber.toString().padStart(3, '0'));
        member.ownQueue = queue;

        await this.queueRepository.save(queue);
        return await this.memberRepository.save(member);
    }

    async editMember(editMemberDto: EditMemberDto, queueId: number, user: UserEntity): Promise<MemberEntity> {
        const queue = await this.searchQueueFromUser(queueId, user);
        const member = await this.findById(editMemberDto.id);

        if(!member) {
            throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
        }

        Object.assign(member, editMemberDto);
        return await this.memberRepository.save(member);
    }

    async deleteMember(memberId: number, queueId: number, user: UserEntity): Promise<MemberEntity> {
        const queue = await this.searchQueueFromUser(queueId, user);
        const member = await this.findById(memberId);

        if(!member) {
            throw new HttpException('Member not found', HttpStatus.NOT_FOUND);
        }

        member.isActive = false;
        return await this.memberRepository.save(member);
    }

    async getMembers(queueId: number, user: UserEntity): Promise<MemberEntity[]> {
        const queue = await this.searchQueueFromUser(queueId, user);
        return await this.memberRepository.find({ ownQueue: queue, isActive: true });
    }

    async deleteAllAndRestart(queueId: number, user: UserEntity): Promise<MemberEntity[]> {
        const queue = await this.searchQueueFromUser(queueId, user);
        const members = await this.memberRepository.find({ ownQueue: queue });

        members.forEach((item) => {
            item.isActive = false;
        });
        queue.ticketNumber = 0;

        await this.queueRepository.save(queue);
        return await this.memberRepository.save(members);
    }

    //Utils functions
    findById(id: number, options?): Promise<MemberEntity> {
        return this.memberRepository.findOne(id, options);
    }

    findByParams(params?): Promise<MemberEntity> {
        return this.memberRepository.findOne(params)
    }

    async searchQueueFromUser(queueId: number, user: UserEntity) {
        const queue = await this.queueRepository.findOne({id: queueId, owner: user })
        if(!queue) {
            throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return queue;
    }
}