import { ValidationError } from './errors';

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

export async function presidioRedaction(
  inputText: string,
  currentSet: string
): Promise<string> {
  const req = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: inputText, filterSet: currentSet }),
  };
  const res = await fetch('/api/presidio', req);
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }
  const redacted = await res.json();
  if (!redacted.presidio) throw new Error('Redaction Error!');
  return redacted.presidio;
}

export function validate(inputText: string, currentSet?: string) {
  const textLengthVal = inputText.length < 4095;
  const textRequiredVal = inputText.length > 0;
  const filterSelectVal = currentSet !== 'initial';

  if (!textLengthVal && filterSelectVal) {
    throw new ValidationError('Prompt must be less than 4096 characters!');
  }
  if (!textRequiredVal && filterSelectVal) {
    throw new ValidationError('Prompt is required!');
  }
  // important to test currentSet for undefined not falsy values, as
  // empty string is valid here ~> intentionally no filter set
  if (currentSet === undefined) return;

  if (textLengthVal && textRequiredVal && !filterSelectVal) {
    throw new ValidationError('Filter Set selection, or "None" is required!');
  }
  if (!textLengthVal && !filterSelectVal) {
    throw new ValidationError(
      'Write a little something, then select a Filter Set!'
    );
  }
  if (!textRequiredVal && !filterSelectVal) {
    throw new ValidationError(
      "Woah there! Must be less than 4096 characters + Don't forget to select a Filter Set"
    );
  }
}
