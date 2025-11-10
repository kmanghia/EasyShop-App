export class ErrorModel {
    status?: number;
    message?: string;
    body?: any;

    constructor(
        status?: number,
        message?: string,
        body?: any
    ) {
        this.status = status;
        this.message = message ?? 'UNKNOWN';
        this.body = body ?? undefined;
    }
}