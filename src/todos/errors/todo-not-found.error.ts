export class TodoNotFoundError extends Error {
    constructor(message='Not Found') {
        super(message);
    }
}