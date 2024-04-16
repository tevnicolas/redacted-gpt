-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

insert into "users"
    ("username", "passwordHash")
  values
    ('Brian', 'Wilson');

insert into "filterSets"
    ("label", "userId", "name", "phoneNumber",
    "emailAddress", "dateTime", "location",
    "usSsn", "usDriversLicense", "cryptoWalletNumber",
    "usBankNumber")
  values
    ('schedules1', 1, false, true,
    true, true, true,
    false, false, false,
    false);
