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
  "person" boolean NOT NULL,
  "phoneNumber" boolean NOT NULL,
  "emailAddress" boolean NOT NULL,
  "dateTime" boolean NOT NULL,
  "location" boolean NOT NULL,
  "usSsn" boolean NOT NULL,
  "usDriverLicense" boolean NOT NULL,
  "crypto" boolean NOT NULL,
  "usBankNumber" boolean NOT NULL,
  "creditCard" boolean NOT NULL,
  "ipAddress" boolean NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (now()),
  "modifiedAt" timestamptz NOT NULL DEFAULT (now())
);

ALTER TABLE "filterSets" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

-- Create a function to update modifiedAt
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW."modifiedAt" = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for the filterSets table
CREATE TRIGGER set_filterset_modified
BEFORE UPDATE ON "filterSets"
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
