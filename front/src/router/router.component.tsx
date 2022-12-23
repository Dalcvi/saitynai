import { Route, Routes } from 'react-router-dom';
import { CategoryPage } from '../category-page';
import { SiteNavbar } from '../site-navbar';
import { PostPage, PostsPage } from '../posts-page';

export const Router = () => {
  return (
    <Routes>
      <Route index element={<CategoryPage />} />
      <Route path="/category/:categoryId/posts" element={<PostsPage />} />
      <Route path="/category/:categoryId/posts/:postId" element={<PostPage />} />
    </Routes>
  );
};
