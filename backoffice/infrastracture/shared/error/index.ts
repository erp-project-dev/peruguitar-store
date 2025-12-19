export class ApplicationError extends Error {
  constructor(
    public readonly code:
      | "not-found"
      | "schema-invalid"
      | "taken"
      | "error"
      | "forbidden",
    public readonly message: string
  ) {
    super(message);
  }
}
