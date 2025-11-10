export class PaginateModel {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;

    constructor(
        currentPage?: number,
        totalPages?: number,
        totalItems?: number,
        limit?: number,
    ) {
        this.currentPage = currentPage ?? 1;
        this.totalPages = totalPages ?? 1;
        this.totalItems = totalItems ?? 0;
        this.limit = limit ?? 10;
    }

    convertObj(data: any) {
        const obj = new PaginateModel();
        obj.currentPage = data?.currentPage ?? 1;
        obj.totalPages = data?.totalPages ?? 1;
        obj.totalItems = data?.totalItems ?? 0;
        obj.limit = data?.limit ?? 10;

        return obj;
    }
}