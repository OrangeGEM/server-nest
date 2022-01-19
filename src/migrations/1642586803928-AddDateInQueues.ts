import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDateInQueues1642586803928 implements MigrationInterface {
    name = 'AddDateInQueues1642586803928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queues" ADD "date" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queues" DROP COLUMN "date"`);
    }

}
