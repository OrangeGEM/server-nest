import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { hash } from 'bcrypt';
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'users' })
export class UserEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number
    
    @ApiProperty()
    @Column({default: ''})
    username: string

    @ApiProperty()
    @Column()
    email: string

    @ApiProperty()
    @Column({ select: false })
    password: string

    @ApiProperty()
    @Column({default: ''})
    fullName: string

    @ApiProperty()
    @Column({default: ''})
    image: string;

    @ApiProperty()
    @Column({default: ''})
    lang: string

    @ApiProperty()
    @Column({default: true})
    isActive: boolean

    @ApiProperty()
    @Column({default: ''})
    activatedLink: string


    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 12);
    }
}