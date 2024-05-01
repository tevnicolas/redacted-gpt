export type SessionFilterSet = {
  label: string;
  person: boolean;
  phoneNumber: boolean;
  emailAddress: boolean;
  dateTime: boolean;
  location: boolean;
  usSsn: boolean;
  usDriverLicense: boolean;
  crypto: boolean;
  usBankNumber: boolean;
  creditCard: boolean;
  ipAddress: boolean;
};

export type AccountFilterSet = SessionFilterSet & {
  filterSetId: number;
};

export type FilterSet = SessionFilterSet | AccountFilterSet;
