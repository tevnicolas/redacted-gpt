export class ValidationError extends Error {
  isValidationError: boolean;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.isValidationError = true;
  }
  toString() {
    // Only return message, omitting 'Validation Error' or 'Error'
    return this.message;
  }
}
