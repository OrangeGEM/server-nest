import { Body, Controller, Get, Module, Param, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
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
import { UpdatePasswordAuthUserDto } from "./dto/updatePasswordAuthUser";
import { UpdatePasswordNonAuthLinkDto } from "./dto/updatePasswordNonAuthLink";
import { UpdatePasswordNonAuthUserDto } from "./dto/updatePasswordNonAuthUser";

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
    async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
        const user = await this.userService.loginUser(loginUserDto)
        return this.userService.buildUserResponse(user)
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
    ): Promise<UserEntity> {
        const user = await this.userService.updateUser(updateUserDto, userId)
        return user;
    }

    @Put('activate')
    @ApiBody({ type: ActivateUserDto })
    @ApiTags("User")
    @ApiResponse({ status: 200, description:"User update"})
    @ApiResponse({ status: 422, description:"Email already activate" })
    async activateUser(
        @Body() activateUserDto: ActivateUserDto
    ): Promise<UserResponseInterface> {
        const user = await this.userService.activateUser(activateUserDto)
        return this.userService.buildUserResponse(user);
    }

    @Put('update-auth-password')
    @UseGuards(AuthGuard)
    @ApiBody({ type: UpdatePasswordAuthUserDto, })
    @ApiTags("User")
    @ApiResponse({ status: 200, description:"User update"})
    @ApiResponse({ status: 422, description:"Password incorrected" })
    @ApiHeader({
        name:"authorization",
        description:"JWT Token"
    })
    async updatePasswordAuthUser(
        @Body() updatePasswordAuthUserDto: UpdatePasswordAuthUserDto,
        @User('id') userId: number
    ): Promise<UserEntity> {
        const user = await this.userService.updateUserPassword(updatePasswordAuthUserDto, userId);
        return user;
    }
    
    @Put('update-nonauth-password')
    @ApiBody({ type: UpdatePasswordNonAuthUserDto })
    @ApiTags("User")
    @ApiResponse({ status: 200, description:"User update"})
    @ApiResponse({ status: 422, description:"Token not valid" })
    async updatePasswordNonAuthUser(
        @Body() updatePasswordNonAuthUserDto: UpdatePasswordNonAuthUserDto
    ) : Promise<UserEntity> {
        const user = await this.userService.updateUserPasswordNonAuth(updatePasswordNonAuthUserDto)
        return user;
    }

    @Get('update-nonauth-link')
    @ApiBody({ type: UpdatePasswordNonAuthLinkDto })
    @ApiTags("User")
    @ApiResponse({ status: 200, description:"User update"})
    @ApiResponse({ status: 404, description:"Email are not found" })
    async updatePasswordNonAuthLink(
        @Body() updatePasswordNonAuthLinkDto: UpdatePasswordNonAuthLinkDto 
    ) : Promise<UserEntity> {
        const user = await this.userService.sendUpdatePasswordLink(updatePasswordNonAuthLinkDto)
        await this.mailService.sendUpdatePasswordLink(user);
        return user;
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
    async currentUser(@User() user: UserEntity): Promise<UserEntity> {
        return user;
    }
} 