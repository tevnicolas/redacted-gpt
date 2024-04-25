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
export function validateSubmission(inputText: string, currentSet?: string) {
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

export class ReqInProgressError extends Error {
  isReqInProgressError: boolean;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.isReqInProgressError = true;
  }
  toString() {
    // Only return message
    return this.message;
  }
}

export function reqInProgressCheck(isLoading: boolean, handleFunction: string) {
  if (!isLoading) return;
  const actions = {
    redact: 'Redacting',
    prompt: 'Generating a response',
  };
  const action = actions[handleFunction] || 'Processing'; // Default action
  throw new ReqInProgressError(`Woah there! ${action}, sit tight.`);
}
