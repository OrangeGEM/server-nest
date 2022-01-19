import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRelationBetweenQueuesAndUser1642584899004 implements MigrationInterface {
    name = 'AddRelationBetweenQueuesAndUser1642584899004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "queues" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "keyword" character varying NOT NULL, "description" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" integer, CONSTRAINT "PK_d966f9eb39a9396658387071bb3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "queues" ADD CONSTRAINT "FK_de5c58d7de78346938a453fd81b" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "queues" DROP CONSTRAINT "FK_de5c58d7de78346938a453fd81b"`);
        await queryRunner.query(`DROP TABLE "queues"`);
    }

}
