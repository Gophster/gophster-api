import { MigrationInterface, QueryRunner } from 'typeorm';

export class FollowCreated1588532210674 implements MigrationInterface {
  name = 'FollowCreated1588532210674';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "follow" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "followingAmount" SET DEFAULT '0'`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "followersAmount" SET DEFAULT '0'`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "followingAmount" SET DEFAULT '0'`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "followersAmount" SET DEFAULT '0'`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "followersAmount" SET DEFAULT 0`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "followingAmount" SET DEFAULT 0`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "followersAmount" SET DEFAULT 0`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "followingAmount" SET DEFAULT 0`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" DROP COLUMN "created"`,
      undefined,
    );
  }
}
