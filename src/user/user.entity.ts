import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { hash } from 'bcrypt';

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({default: ''})
    username: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({default: ''})
    fullName: string

    @Column({default: ''})
    image: string;

    @Column({default: ''})
    lang: string

    @Column({default: true})
    isActive: boolean

    @Column({default: ''})
    activatedLink: string


    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 12);
    }
}