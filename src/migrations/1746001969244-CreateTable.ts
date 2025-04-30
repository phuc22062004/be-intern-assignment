import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1746001969244 implements MigrationInterface {
    name = 'CreateTable1746001969244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "followerId" integer NOT NULL, "followingId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, CONSTRAINT "UQ_105079775692df1f8799ed0fac8" UNIQUE ("followerId", "followingId"), CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb" FOREIGN KEY ("followingId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_fdb91868b03a2040db408a53331" FOREIGN KEY ("followerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_follows"("id", "followerId", "followingId", "createdAt") SELECT "id", "followerId", "followingId", "createdAt" FROM "follows"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`ALTER TABLE "temporary_follows" RENAME TO "follows"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follows" RENAME TO "temporary_follows"`);
        await queryRunner.query(`CREATE TABLE "follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "followerId" integer NOT NULL, "followingId" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_105079775692df1f8799ed0fac8" UNIQUE ("followerId", "followingId"), CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb" FOREIGN KEY ("followingId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_fdb91868b03a2040db408a53331" FOREIGN KEY ("followerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "follows"("id", "followerId", "followingId", "createdAt") SELECT "id", "followerId", "followingId", "createdAt" FROM "temporary_follows"`);
        await queryRunner.query(`DROP TABLE "temporary_follows"`);
    }

}
