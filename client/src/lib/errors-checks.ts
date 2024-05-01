import { FilterSet } from 'shared/types';
import { defaultFilterSet } from './default-filter-set';

/** To distinguish between client side validation and other errors. Basically starting at the toString() I'm insisting no prepended error ('Error: ' or 'ValidationError: ') because I don't think my simple form style validation needs an error warning */
export class ValidationError extends Error {
  isValidationError: boolean;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.isValidationError = true;
  }
  toString() {
    // Only return message
    return this.message;
  }
}

/**  Basically my (<form/>less) controlled form validation with a few custom message combinations  */
export function validateSubmission(
  inputText: string,
  currentSet?: string
): void {
  const textLengthVal = inputText.length < 4095;
  const textRequiredVal = inputText.length > 0;
  const filterSelectVal = currentSet !== 'initial';

  if (!textLengthVal && filterSelectVal) {
    throw new ValidationError('Prompt must be less than 4096 characters!');
  }
  if (!textRequiredVal && filterSelectVal) {
    throw new ValidationError('Prompt is required!');
  }
  if (!currentSet) return;

  if (textLengthVal && textRequiredVal && !filterSelectVal) {
    throw new ValidationError('Filter Set selection, or "None" is required!');
  }
  if (!textRequiredVal && !filterSelectVal) {
    throw new ValidationError(
      'Write a little something ——then select a Filter Set!'
    );
  }
  if (!textLengthVal && !filterSelectVal) {
    throw new ValidationError(
      "Woah there! Must be less than 4096 characters + Don't forget to select a Filter Set"
    );
  }
}

/** Error if there is any attempt to make an additional request while a request is in progress. This is specifically for api requests which call on Presidio or OpenAi services.  */

export class ReqInProgressError extends Error {
  isReqInProgressError: boolean;

  constructor(message: string) {
    super(message);
    this.name = 'ReqInProgressError';
    this.isReqInProgressError = true;
  }
  toString() {
    // Only return message
    return this.message;
  }
}

/**
 * Checks if a request is in progress.
 * @param isLoading - boolean value to check if a request is in progress.
 * @param handleFunction - string value which determines which action to report.
 */
export function reqInProgressCheck(
  isLoading: boolean,
  handleFunction: string
): void {
  if (!isLoading) return;
  const actions = {
    redact: 'Redacting',
    prompt: 'Generating a response',
  };
  const action = actions[handleFunction] || 'Processing'; // Default action
  throw new ReqInProgressError(`Woah there! ${action}, sit tight.`);
}

/** This Error is used when a token is present but has expired or is incorrect. It makes this case clear so that it can be handled with an automatic sign out. */
export class UnauthorizedError extends Error {
  isUnauthorizedError: boolean;

  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    this.isUnauthorizedError = true;
  }
  toString() {
    return `Unauthorized: ${this.message}`;
  }
}

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
