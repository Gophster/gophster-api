import { MigrationInterface, QueryRunner } from 'typeorm';

export class Follow1588506074652 implements MigrationInterface {
  name = 'Follow1588506074652';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "follow" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "authorId" uuid, "reciverId" uuid, CONSTRAINT "PK_fda88bc28a84d2d6d06e19df6e5" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ADD CONSTRAINT "FK_69d2e00ebb4b4b17aef5d8f9580" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ADD CONSTRAINT "FK_91b0e7a303f314aa8914335e3f1" FOREIGN KEY ("reciverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "follow" DROP CONSTRAINT "FK_91b0e7a303f314aa8914335e3f1"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" DROP CONSTRAINT "FK_69d2e00ebb4b4b17aef5d8f9580"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "follow"`, undefined);
  }
}
