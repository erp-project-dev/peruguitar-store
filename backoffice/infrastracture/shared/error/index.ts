type ApplicationErrorCode =
  | "not-found"
  | "schema-invalid"
  | "taken"
  | "error"
  | "forbidden";

export class ApplicationError extends Error {
  constructor(
    public readonly code: ApplicationErrorCode,
    public readonly message: string
  ) {
    super(message);
  }
}
