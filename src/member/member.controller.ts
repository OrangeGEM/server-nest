import { User } from "@app/user/decorators/user.decorator";
import { AuthGuard } from "@app/user/guards/auth.guard";
import { UserEntity } from "@app/user/user.entity";
import { Body, Controller, Delete, Get, Post, Put, UseGuards } from "@nestjs/common";
import { CreateMemberDto } from "./dto/createMember.dto";
import { EditMemberDto } from "./dto/editMember.dto";
import { MemberEntity } from "./member.entity";
import { MemberService } from "./member.service";

@Controller('member')
export class MemberController {
    constructor(
        private readonly memberService: MemberService
    ) {}

    @Post('create')
    @UseGuards(AuthGuard)
    async createMember(
        @Body('params') createMemberDto: CreateMemberDto,
        @Body('queueId') queueId: number,
        @User() user: UserEntity, 
    ): Promise<MemberEntity> {
        return await this.memberService.createMember(createMemberDto, queueId, user)
    }

    @Put('edit')
    @UseGuards(AuthGuard)
    async editMember(
        @Body('params') editMemberDto: EditMemberDto,
        @Body('queueId') queueId: number,
        @User() user: UserEntity, 
    ): Promise<MemberEntity> {
        return await this.memberService.editMember(editMemberDto, queueId, user)
    }

    @Delete('delete')
    @UseGuards(AuthGuard)
    async deleteMember(
        @Body('id') memberId: number,
        @Body('queueId') queueId: number,
        @User() user: UserEntity, 
    ): Promise<MemberEntity> {
        return await this.memberService.deleteMember(memberId, queueId, user)
    }

    @Delete('delete-restart')
    @UseGuards(AuthGuard)
    async deleteAllAndRestart(
        @Body('id') memberId: number,
        @Body('queueId') queueId: number,
        @User() user: UserEntity, 
    ): Promise<MemberEntity[]> {
        return await this.memberService.deleteAllAndRestart(queueId, user)
    }

    @Get('get')
    @UseGuards(AuthGuard)
    async getMembers(
        @Body('queueId') queueId: number,
        @User() user: UserEntity, 
    ): Promise<MemberEntity[]> {
        return await this.memberService.getMembers(queueId, user)
    }
} {}