import { MigrationInterface, QueryRunner } from 'typeorm';

export class messengerId1592514552599 implements MigrationInterface {
  name = 'messengerId1592514552599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "messengerId" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "messengerId"`);
  }
}
