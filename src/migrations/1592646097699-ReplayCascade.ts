import {MigrationInterface, QueryRunner} from "typeorm";

export class ReplayCascade1592646097699 implements MigrationInterface {
    name = 'ReplayCascade1592646097699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_abd78e529f3b394cf4533bc5f63"`);
        await queryRunner.query(`ALTER TABLE "reply" ADD CONSTRAINT "FK_abd78e529f3b394cf4533bc5f63" FOREIGN KEY ("gophId") REFERENCES "goph"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_abd78e529f3b394cf4533bc5f63"`);
        await queryRunner.query(`ALTER TABLE "reply" ADD CONSTRAINT "FK_abd78e529f3b394cf4533bc5f63" FOREIGN KEY ("gophId") REFERENCES "goph"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
