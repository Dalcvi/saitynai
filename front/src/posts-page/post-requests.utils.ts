import { GetPostRequest, Post } from "./post.types";

export const fetchPosts = async (categoryId: number) => {
    const request = await fetch(`${process.env.REACT_APP_API}/categories/${categoryId}/posts`, {
        method: 'GET'
    });
    const requestData = await request.json();

    return requestData as GetPostRequest;
}

export const fetchPost = async (categoryId: number, postId: number) => {
    const request = await fetch(`${process.env.REACT_APP_API}/categories/${categoryId}/posts/${postId}`, {
        method: 'GET'
    });
    const requestData = await request.json();

    return requestData as Post;
}

export const postPost = async (categoryId: number, title: string, content: string, token: string) => {
        await fetch(`${process.env.REACT_APP_API}/categories/${categoryId}/posts`, {
        method: 'POST',
                headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({content, title})
    });
} 

export const editPost = async (categoryId: number, postId: number, title: string, content: string, token: string) => {
        await fetch(`${process.env.REACT_APP_API}/categories/${categoryId}/posts/${postId}`, {
        method: 'PUT',
                headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({content, title})
    });
} 

export const deletePost = async (categoryId: number, postId: number, token: string) => {
        await fetch(`${process.env.REACT_APP_API}/categories/${categoryId}/posts/${postId}`, {
        method: 'DELETE',
                headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
    });
} 