import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserSocketId1592163201758 implements MigrationInterface {
  name = 'UserSocketId1592163201758';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "socketId" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "socketId"`);
  }
}
