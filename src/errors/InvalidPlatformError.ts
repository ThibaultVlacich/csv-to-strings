export default class InvalidPlatformError extends Error {
  constructor() {
    super('Unsupported platform')
  }
}
