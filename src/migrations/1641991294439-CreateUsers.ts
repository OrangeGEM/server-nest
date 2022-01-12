import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUsers1641991294439 implements MigrationInterface {
    name = 'CreateUsers1641991294439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL DEFAULT '', "email" character varying NOT NULL, "password" character varying NOT NULL, "fullName" character varying NOT NULL DEFAULT '', "image" character varying NOT NULL DEFAULT '', "lang" character varying NOT NULL DEFAULT '', "isActive" boolean NOT NULL DEFAULT true, "activatedLink" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
