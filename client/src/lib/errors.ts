/* To distinguish between client side validation and other errors. Basically starting at the toString() I'm insisting no prepended error ('Error: ' or 'ValidationError: ') because I don't think my simple form style validation needs an error warning */

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
