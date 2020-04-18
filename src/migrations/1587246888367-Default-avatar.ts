import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultAvatar1587246888367 implements MigrationInterface {
  name = 'DefaultAvatar1587246888367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "avatar" SET DEFAULT 'default-avatar.png'`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "avatar" SET DEFAULT 'default-avatar.png'`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "avatar" DROP DEFAULT`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "avatar" DROP DEFAULT`,
      undefined,
    );
  }
}
