import {MigrationInterface, QueryRunner} from "typeorm";

export class NotificationLink1591997064065 implements MigrationInterface {
    name = 'NotificationLink1591997064065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "link" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "link"`);
    }

}
