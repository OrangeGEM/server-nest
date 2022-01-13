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

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    @UsePipes(new ValidationPipe())
    async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserResponse(user);
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface>{
        const user = await this.userService.loginUser(loginUserDto)
        return this.userService.buildUserResponse(user)
    }

    @Get()
    @UseGuards(AuthGuard)
    async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
        return this.userService.buildUserResponse(user);
    }

    @Put('update')
    @UseGuards(AuthGuard)
    async updateUser(
        @Body('params') updateUserDto: UpdateUserDto, 
        @User('id') userId: number,
    ): Promise<UserResponseInterface> {//Any delete
        const user = await this.userService.updateUser(updateUserDto, userId)
        return this.userService.buildUserResponse(user)
    }
} 