CREATE TABLE "users"(
    "id" BIGSERIAL PRIMARY KEY NOT NULL,
    "username" VARCHAR(255) NULL,
    "f_name" VARCHAR(255) NULL,
    "l_name" VARCHAR(255) NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) CHECK("role" IN('USER', 'REDACTOR', 'MODERATOR', 'ADMIN')) NOT NULL,
    "avatar" TEXT NULL,
    "ban" BOOLEAN NOT NULL DEFAULT '0',
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE "categorie"(
    "id" BIGSERIAL PRIMARY KEY NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "id_category_parent" BIGINT NULL
);

CREATE TABLE "tutorial"(
    "id" BIGSERIAL PRIMARY KEY NOT NULL,
    "id_users" BIGINT NOT NULL,
    "id_category" BIGINT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "view_count" BIGINT NULL,
    "durate" BIGINT NULL,
    "draft" BOOLEAN NOT NULL DEFAULT '1',
    "banned" BOOLEAN NOT NULL DEFAULT '0',
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE "commentary"(
    "id" BIGSERIAL PRIMARY KEY NOT NULL,
    "id_tutorial" BIGINT NOT NULL,
    "id_user" BIGINT NOT NULL,
    "parent_id" BIGINT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE "rating"(
    "id" BIGSERIAL PRIMARY KEY NOT NULL,
    "id_tutorial" BIGINT NOT NULL,
    "id_user" BIGINT NOT NULL,
    "rating_value" BIGINT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE "jwt_tokens"(
    "id" BIGSERIAL PRIMARY KEY NOT NULL,
    "user_id" BIGINT NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expiration" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);

ALTER TABLE "categorie"
    ADD CONSTRAINT categorie_id_category_parent_foreign
    FOREIGN KEY("id_category_parent") REFERENCES "categorie"("id") ON DELETE CASCADE;

ALTER TABLE "tutorial"
    ADD CONSTRAINT tutorial_id_users_foreign
    FOREIGN KEY("id_users") REFERENCES "users"("id");

ALTER TABLE "tutorial"
    ADD CONSTRAINT tutorial_id_category_foreign
    FOREIGN KEY("id_category") REFERENCES "categorie"("id");

ALTER TABLE "commentary"
    ADD CONSTRAINT commentary_parent_id_foreign
    FOREIGN KEY("parent_id") REFERENCES "commentary"("id") ON DELETE CASCADE;

ALTER TABLE "commentary"
    ADD CONSTRAINT commentary_id_tutorial_foreign
    FOREIGN KEY("id_tutorial") REFERENCES "tutorial"("id") ON DELETE CASCADE;

ALTER TABLE "commentary"
    ADD CONSTRAINT commentary_id_user_foreign
    FOREIGN KEY("id_user") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "rating"
    ADD CONSTRAINT rating_id_tutorial_foreign
    FOREIGN KEY("id_tutorial") REFERENCES "tutorial"("id") ON DELETE CASCADE;

ALTER TABLE "rating"
    ADD CONSTRAINT rating_id_user_foreign
    FOREIGN KEY("id_user") REFERENCES "users"("id");

ALTER TABLE "jwt_tokens"
    ADD CONSTRAINT jwt_tokens_user_id_foreign
    FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
