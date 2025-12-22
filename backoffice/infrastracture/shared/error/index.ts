type ApplicationErrorCode =
  | "not-found"
  | "schema-invalid"
  | "taken"
  | "conflict"
  | "error"
  | "unauthorized"
  | "in-use"
  | "forbidden";

export class ApplicationError extends Error {
  constructor(
    public readonly code: ApplicationErrorCode,
    public readonly message: string
  ) {
    super(message);
  }
}
