export class RequestValidationError extends Error {
  public constructor() {
    super("Request validation failed.");

    this.name = "RequestValidationError";
  }
}
