import { GetCommentRequest } from "./comments.types";

export const fetchComments = async (categoryId: number, postId: number) => {
    const request = await fetch(`${process.env.REACT_APP_API}/categories/${categoryId}/posts/${postId}/comments`, {
        method: 'GET'
    });
    const requestData = await request.json();

    return requestData as GetCommentRequest;
}

export const postComment = async (categoryId: number, postId: number, content: string, token: string) => {
        await fetch(`${process.env.REACT_APP_API}/categories/${categoryId}/posts/${postId}/comments`, {
        method: 'POST',
                headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({content})
    });
} 

export const editComment = async (categoryId: number, postId: number, commentId: number, content: string, token: string) => {
        await fetch(`${process.env.REACT_APP_API}/categories/${categoryId}/posts/${postId}/comments/${commentId}`, {
        method: 'PUT',
                headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({content})
    });
} 

export const deleteComment = async (categoryId: number, postId: number, commentId: number, token: string) => {
        await fetch(`${process.env.REACT_APP_API}/categories/${categoryId}/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
                headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
    });
} 