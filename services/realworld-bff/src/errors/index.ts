export class InsertError extends Error {
  constructor(message: string) {
    super("Insert Error: " + message);
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super("Authentication Error: " + message);
  }
}
