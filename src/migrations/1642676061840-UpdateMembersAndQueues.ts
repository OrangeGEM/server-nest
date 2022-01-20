import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateMembersAndQueues1642676061840 implements MigrationInterface {
    name = 'UpdateMembersAndQueues1642676061840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members" DROP COLUMN "ticketNumber"`);
        await queryRunner.query(`ALTER TABLE "queues" ADD "ticketNumber" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queues" DROP COLUMN "ticketNumber"`);
        await queryRunner.query(`ALTER TABLE "members" ADD "ticketNumber" integer NOT NULL DEFAULT '0'`);
    }

}
