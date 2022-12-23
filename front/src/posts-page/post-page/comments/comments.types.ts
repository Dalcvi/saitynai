import { GetRequests } from "../../../request/request.type";
import { User } from "../../../user";

export type Comment = {
    id: number;
    postId: number
    content: string;
    createdDate: string;
    user: User;
}

export type GetCommentRequest = GetRequests<Comment>;
