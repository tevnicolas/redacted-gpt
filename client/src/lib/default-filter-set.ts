import { SessionFilterSet } from 'shared/types';

export const defaultFilterSet: SessionFilterSet = {
  label: '',
  person: false,
  phoneNumber: false,
  emailAddress: false,
  dateTime: false,
  location: false,
  usSsn: false,
  usDriverLicense: false,
  crypto: false,
  usBankNumber: false,
  creditCard: false,
  ipAddress: false,
};
