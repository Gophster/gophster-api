import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatedFields1586591023228 implements MigrationInterface {
  name = 'CreatedFields1586591023228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "goph" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "goph" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "created"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "goph" DROP COLUMN "updated"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "goph" DROP COLUMN "created"`,
      undefined,
    );
  }
}
