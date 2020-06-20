import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovMessengerId1592557033329 implements MigrationInterface {
  name = 'RemovMessengerId1592557033329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "messengerId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "messengerId" character varying`,
    );
  }
}
