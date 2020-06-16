import {MigrationInterface, QueryRunner} from "typeorm";

export class Reply1592047665892 implements MigrationInterface {
    name = 'Reply1592047665892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reply" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "text" character varying NOT NULL, "authorId" uuid, "gophId" uuid, CONSTRAINT "PK_94fa9017051b40a71e000a2aff9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reply" ADD CONSTRAINT "FK_9c7aa85b4b2be67c1b7235d03fe" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reply" ADD CONSTRAINT "FK_abd78e529f3b394cf4533bc5f63" FOREIGN KEY ("gophId") REFERENCES "goph"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_abd78e529f3b394cf4533bc5f63"`);
        await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_9c7aa85b4b2be67c1b7235d03fe"`);
        await queryRunner.query(`DROP TABLE "reply"`);
    }

}
