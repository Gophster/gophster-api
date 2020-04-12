import {MigrationInterface, QueryRunner} from "typeorm";

export class UserResetToken1586717998849 implements MigrationInterface {
    name = 'UserResetToken1586717998849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "resetToken" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "resetTokenExpiration" TIMESTAMP`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetTokenExpiration"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetToken"`, undefined);
    }

}
