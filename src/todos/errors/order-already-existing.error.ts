export class OrderAlreadyExistingError extends Error {
    constructor(message='Conflict') {
        super(message);
    }
}