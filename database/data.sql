-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

insert into "users"
    ("username", "passwordHash")
  values
    ('brian@me.com', 'wilson');

insert into "filterSets"
    ("label", "userId", "person", "phoneNumber",
    "emailAddress", "dateTime", "location",
    "usSsn", "usDriverLicense", "crypto",
    "usBankNumber", "creditCard", "ipAddress")
  values
    ('schedules1', 1, false, true,
    true, true, true,
    false, false, false,
    false, true, true);
