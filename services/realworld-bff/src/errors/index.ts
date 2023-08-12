export class InsertError extends Error {
  constructor(message: string) {
    super("Insert Error: " + message);
  }
}
