import { GetRequests } from "../request/request.type";
import { User } from "../user";

export type Post = {
    id: number;
    title: string;
    content: string;
    categoryId: number;
    createdDate: string;
    user: User;
}

export type GetPostRequest = GetRequests<Post>;
