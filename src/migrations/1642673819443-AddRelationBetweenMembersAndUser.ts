import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRelationBetweenMembersAndUser1642673819443 implements MigrationInterface {
    name = 'AddRelationBetweenMembersAndUser1642673819443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "members" ("id" SERIAL NOT NULL, "ticket" character varying NOT NULL, "phone" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownQueueId" integer, CONSTRAINT "PK_28b53062261b996d9c99fa12404" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "members" ADD CONSTRAINT "FK_d0a6e8d1a28dc01572af508a6df" FOREIGN KEY ("ownQueueId") REFERENCES "queues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "members" DROP CONSTRAINT "FK_d0a6e8d1a28dc01572af508a6df"`);
        await queryRunner.query(`DROP TABLE "members"`);
    }

}
