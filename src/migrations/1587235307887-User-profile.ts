import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserProfile1587235307887 implements MigrationInterface {
  name = 'UserProfile1587235307887';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "name" character varying(50)`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "location" character varying(30)`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "birthdate" TIMESTAMP`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "avatar" character varying`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "avatar"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "birthdate"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "location"`,
      undefined,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`, undefined);
  }
}
