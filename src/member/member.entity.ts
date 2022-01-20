import { QueueEntity } from "@app/queue/queue.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'members' })
export class MemberEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ticket: string;

    @Column()
    phone: string;

    @Column()
    date: Date;

    @Column({default: true})
    isActive: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @ManyToOne(() => QueueEntity, queue => queue.members)
    ownQueue: QueueEntity;

    @BeforeUpdate()
    async updateTimestamp() {
        this.updatedAt = new Date();
    }
}