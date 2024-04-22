export type UnsavedFilterSet = {
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

export type FilterSet = UnsavedFilterSet & {
  filterSetId: number;
};
