import { FilterSet, SessionFilterSet } from 'shared/types';

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

export function isDefaultFilterSet(filterSet: FilterSet): boolean {
  const allowedExtraKey = 'filterSetId';
  const keys = Object.keys(filterSet);
  const defaultKeys = Object.keys(defaultFilterSet);
  // Check for exact match or one additional 'filterSetId' key
  if (
    keys.length !== defaultKeys.length &&
    keys.length !== defaultKeys.length + 1
  ) {
    return false;
  }
  // Ensure that any additional key is exactly 'filterSetId'
  if (
    keys.length === defaultKeys.length + 1 &&
    !keys.includes(allowedExtraKey)
  ) {
    return false;
  }
  // Check all keys in defaultFilterSet for value match
  for (const key of defaultKeys) {
    if (filterSet[key] !== defaultFilterSet[key]) {
      return false;
    }
  }

  return true;
}
