import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateUserEntity1642165555430 implements MigrationInterface {
    name = 'UpdateUserEntity1642165555430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "activatedLink"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isActive" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isActive" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD "activatedLink" character varying NOT NULL DEFAULT ''`);
    }

}
