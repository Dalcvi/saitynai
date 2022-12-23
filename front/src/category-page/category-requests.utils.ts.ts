import { Category, GetCategoryRequest } from "./category.types";

export const fetchCategories = async () => {
    const request = await fetch(`${process.env.REACT_APP_API}/categories`, {
        method: 'GET'
    });
    const requestData = await request.json();

    return requestData as GetCategoryRequest;
}

export const fetchCategory = async (id: number) => {
    const request = await fetch(`${process.env.REACT_APP_API}/categories/${id}`, {
        method: 'GET'
    });
    const requestData = await request.json();

    return requestData as Category;
}

export const postCategory = async (title: string, description: string, token: string) => {
        await fetch(`${process.env.REACT_APP_API}/categories`, {
        method: 'POST',
                headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({description, title})
    });
} 

export const editCategory = async (categoryId: number, title: string, description: string, token: string) => {
        await fetch(`${process.env.REACT_APP_API}/categories/${categoryId}`, {
        method: 'PUT',
                headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({description, title})
    });
} 

export const deleteCategory = async (categoryId: number, token: string) => {
        await fetch(`${process.env.REACT_APP_API}/categories/${categoryId}`, {
        method: 'DELETE',
                headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
    });
} 