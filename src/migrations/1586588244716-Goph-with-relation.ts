import {MigrationInterface, QueryRunner} from "typeorm";

export class GophWithRelation1586588244716 implements MigrationInterface {
    name = 'GophWithRelation1586588244716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "goph" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "authorId" uuid, CONSTRAINT "PK_a21c8375bf5f0b9b31b0ac0a9a5" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "goph" ADD CONSTRAINT "FK_f0f04064cec86dfa7eb8a5527e1" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goph" DROP CONSTRAINT "FK_f0f04064cec86dfa7eb8a5527e1"`, undefined);
        await queryRunner.query(`DROP TABLE "goph"`, undefined);
    }

}
