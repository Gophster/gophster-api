import { MigrationInterface, QueryRunner } from 'typeorm';

export class FollowAmount1588530097223 implements MigrationInterface {
  name = 'FollowAmount1588530097223';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "followingAmount" integer NOT NULL DEFAULT '0'`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "followersAmount" integer NOT NULL DEFAULT '0'`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "followersAmount"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "followingAmount"`,
      undefined,
    );
  }
}
