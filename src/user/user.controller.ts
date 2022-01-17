import { Body, Controller, Get, Module, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConnectableObservable } from "rxjs";
import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";
import { UserResponseInterface } from "./types/userResponse.interface";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { Request } from "express";
import { ExpressRequestInterface } from "@app/types/expressRequest.interface";
import { User } from "./decorators/user.decorator";
import { AuthGuard } from "./guards/auth.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { ApiBody, ApiHeader, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MailService } from "@app/utils/mail/mail.service";
import { ActivateUserDto } from "./dto/activateUser.dto";
import { RefreshPasswordUserDto } from "./dto/refreshPasswordUser.dto";

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService, 
        private readonly mailService: MailService
    ) {}

    @Post('register')
    @UsePipes(new ValidationPipe())
    @ApiBody({ type: CreateUserDto })
    @ApiTags("User")
    @ApiResponse({ status: 201, description:"User create"})
    @ApiResponse({ status: 400, description:"Validation failed" })
    @ApiResponse({ status: 422, description:"Email are taken" })
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
        const user = await this.userService.createUser(createUserDto);
        await this.mailService.sendActivatedLink(user);
        return this.userService.buildUserResponse(user);
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    @ApiBody({ type: LoginUserDto })
    @ApiTags("User")
    @ApiResponse({ status: 201, description:"User login"})
    @ApiResponse({ status: 422, description:"Credentials are not valid" })
    async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface>{
        const user = await this.userService.loginUser(loginUserDto)
        return this.userService.buildUserResponse(user)
    }

    @Get()
    @UseGuards(AuthGuard)
    @ApiTags("User")
    @ApiResponse({ status: 200, description:"User get"})
    @ApiResponse({ status: 401, description:"Not authorized" })
    @ApiHeader({
        name:"authorization",
        description:"JWT Token"
    })
    async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
        return this.userService.buildUserResponse(user);
    }

    @Put('update')
    @UseGuards(AuthGuard)
    @ApiBody({ type: UpdateUserDto })
    @ApiTags("User")
    @ApiResponse({ status: 200, description:"User update"})
    @ApiResponse({ status: 401, description:"Not authorized" })
    async updateUser(
        @Body('params') updateUserDto: UpdateUserDto, 
        @User('id') userId: number,
    ): Promise<UserResponseInterface> {
        const user = await this.userService.updateUser(updateUserDto, userId)
        return this.userService.buildUserResponse(user)
    }

    @Put('activate')
    async activateUser(
        @Body() activateUserDto: ActivateUserDto
    ): Promise<UserResponseInterface> {
        const user = await this.userService.activateUser(activateUserDto)
        return this.userService.buildUserResponse(user);
    }

    @Put('refresh')
    @UseGuards(AuthGuard)
    async refreshPasswordUser(
        @Body() refreshPasswordUserDto: RefreshPasswordUserDto,
        @User('id') userId: number
    ): Promise<UserResponseInterface> {
        const user = await this.userService.updateUserPassword(refreshPasswordUserDto, userId);
        return this.userService.buildUserResponse(user);
    }
} 