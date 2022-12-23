import { GetRequests } from "../request/request.type";

export type Category = {
    id: number;
    title: string;
    description: string;
    createdDate: string;
}

export type GetCategoryRequest = GetRequests<Category>;

