import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationText1591996818574 implements MigrationInterface {
  name = 'NotificationText1591996818574';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "text" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "text"`);
  }
}
