import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { hash } from 'bcrypt';
import { ApiProperty } from "@nestjs/swagger";
import { QueueEntity } from "@app/queue/queue.entity";

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
    @Column({default: false})
    isActive: boolean

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @OneToMany(() => QueueEntity, queue => queue.owner)
    queues: QueueEntity[]; 

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 12);
    }

    @BeforeUpdate()
    async updateTimestamp() {
        this.updatedAt = new Date();
    }

}