import { HttpCode, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getRepository, Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserEntity } from "./user.entity";
import { sign, decode} from 'jsonwebtoken';
import { JWT_SECRET } from "@app/config";
import { UserResponseInterface } from "./types/userResponse.interface";

import { compare, hash } from 'bcrypt';
import { LoginUserDto } from "./dto/loginUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { MailService } from "@app/utils/mail/mail.service";
import { ActivateUserDto } from "./dto/activateUser.dto";
import { UpdatePasswordAuthUserDto } from "./dto/updatePasswordAuthUser";
import { UpdatePasswordNonAuthLinkDto } from "./dto/updatePasswordNonAuthLink";
import { UpdatePasswordNonAuthUserDto } from "./dto/updatePasswordNonAuthUser";
import { PassThrough } from "stream";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    //Register user
    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const userByEmail = await this.userRepository.findOne({
            email: createUserDto.email,
        })
        if(userByEmail) {
            throw new HttpException('Email are taken', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const newUser = new UserEntity();
        Object.assign(newUser, createUserDto);
        console.log('newUser: ', newUser);


        return await this.userRepository.save(newUser);
    }

    //Login user
    async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const user = await this.userRepository.findOne(
            { email: loginUserDto.email, },
            { select: ['id', 'email', 'password'] }
        )
        if(!user) {
            throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const isPassEquels = await compare(loginUserDto.password, user.password);
        if(!isPassEquels) {
            throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        delete user.password;

        return user;
    }

    //Update user
    async updateUser(updateUserDto: UpdateUserDto, userId: number): Promise<UserEntity> {
        const user = await this.findById(userId);
        Object.assign(user, updateUserDto);
        return await this.userRepository.save(user);
    }

    //Activate user email
    async activateUser(activateUserDto: ActivateUserDto): Promise<UserEntity> {
        const decodedJwt = await this.decodeJwt(activateUserDto.token);
        const user = await this.findById(decodedJwt.id);
        
        if(user.isActive) {
            throw new HttpException('Email already activate', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        user.isActive = true;

        return await this.userRepository.save(user);
    }

    async updateUserPassword(updatePasswordAuthUserDto: UpdatePasswordAuthUserDto, userId: number): Promise<UserEntity> {
        const user = await this.findById(userId, {select: ['id', 'password']});

        if(!await compare(updatePasswordAuthUserDto.oldPassword, user.password)) {
            throw new HttpException('Password incorrected', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        user.password = await hash(updatePasswordAuthUserDto.newPassword, 12);
        return await this.userRepository.save(user);
    }

    async sendUpdatePasswordLink(updatePasswordNonAuthLinkDto: UpdatePasswordNonAuthLinkDto) : Promise<UserEntity> {
        const user = await this.findByParams(updatePasswordNonAuthLinkDto)
        if(!user) {
            throw new HttpException('Email are not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    async updateUserPasswordNonAuth(updatePasswordNonAuthUserDto: UpdatePasswordNonAuthUserDto): Promise<UserEntity> {
        const decodedJwt = await this.decodeJwt(updatePasswordNonAuthUserDto.token);
        const user = await this.findById(decode.id);

        if(!user) {
            throw new HttpException('Token not valid', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        user.password = await hash(updatePasswordNonAuthUserDto.password, 12);
        return await this.userRepository.save(user);
    }

    findById(id: number, options?): Promise<UserEntity> {
        return this.userRepository.findOne(id, options);
    }

    findByParams(params?): Promise<UserEntity> {
        return this.userRepository.findOne(params)
    }

    buildUserResponse(user: UserEntity): UserResponseInterface {
        return {
            user: {
                ...user,
                token: this.generateJwt(user)
            }
        }
    }

    public generateJwt(user: UserEntity): string {
        return sign({
            id: user.id,
            email: user.email
        }, JWT_SECRET);
    }

    public decodeJwt(token: string): any {
        return decode(token);
    }

}