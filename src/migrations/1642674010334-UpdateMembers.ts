import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateMembers1642674010334 implements MigrationInterface {
    name = 'UpdateMembers1642674010334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members" ADD "ticketNumber" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members" DROP COLUMN "ticketNumber"`);
    }

}
