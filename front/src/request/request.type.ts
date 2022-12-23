export interface GetRequests <T>{
    items: T[],
    metadata: Metadata
}

export type Metadata = {
    totalCount: number,
    totalPages: number,
    currentPage: number,
    pageSize: number,
}