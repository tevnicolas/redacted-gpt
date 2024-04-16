set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
  "userId" serial PRIMARY KEY NOT NULL,
  "username" text NOT NULL,
  "passwordHash" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "filterSets" (
  "filterSetId" serial PRIMARY KEY NOT NULL,
  "label" text NOT NULL,
  "userId" integer NOT NULL,
  "name" boolean NOT NULL,
  "phoneNumber" boolean NOT NULL,
  "emailAddress" boolean NOT NULL,
  "dateTime" boolean NOT NULL,
  "location" boolean NOT NULL,
  "usSsn" boolean NOT NULL,
  "usDriversLicense" boolean NOT NULL,
  "cryptoWalletNumber" boolean NOT NULL,
  "usBankNumber" boolean NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);

ALTER TABLE "filterSets" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");
