-- This is an empty migration.
-- users 테이블에 컬럼명 name varchar(40) 추가
ALTER TABLE "users" ADD COLUMN "name" varchar(40) NOT NULL DEFAULT '';