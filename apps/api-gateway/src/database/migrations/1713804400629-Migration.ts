import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1713804400629 implements MigrationInterface {
    name = 'Migration1713804400629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'NORMAL', "is_verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "video" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "mimetype" character varying NOT NULL, "download_cnt" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "UQ_99e2178fda31ff2d65764473685" UNIQUE ("title"), CONSTRAINT "PK_1a2f3856250765d72e7e1636c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_99e2178fda31ff2d6576447368" ON "video" ("title") `);
        await queryRunner.query(`CREATE TABLE "user_auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "auth_code" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_d887e2dcbfe0682c46c055f93d" UNIQUE ("user_id"), CONSTRAINT "PK_56d00ec31dc3eed1c3f6bff4f58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "video" ADD CONSTRAINT "FK_0c06b8d2494611b35c67296356c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_auth" ADD CONSTRAINT "FK_d887e2dcbfe0682c46c055f93d6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_auth" DROP CONSTRAINT "FK_d887e2dcbfe0682c46c055f93d6"`);
        await queryRunner.query(`ALTER TABLE "video" DROP CONSTRAINT "FK_0c06b8d2494611b35c67296356c"`);
        await queryRunner.query(`DROP TABLE "user_auth"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_99e2178fda31ff2d6576447368"`);
        await queryRunner.query(`DROP TABLE "video"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
