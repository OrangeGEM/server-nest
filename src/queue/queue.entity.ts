import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { hash } from 'bcrypt';
import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "@app/user/user.entity";

@Entity({ name: 'queues' })
export class QueueEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;
    
    @ApiProperty()
    @Column()
    title: string;

    @ApiProperty()
    @Column()
    keyword: string;

    @ApiProperty()
    @Column()
    description: string;

    @ApiProperty()
    @Column()
    date: Date

    @ApiProperty()
    @Column({default: true})
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @ManyToOne(() => UserEntity, user => user.queues)
    owner: UserEntity;

    @BeforeUpdate()
    async updateTimestamp() {
        this.updatedAt = new Date();
    }

}