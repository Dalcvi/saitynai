import { UseQueryResult, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Category, fetchCategory } from '../../category-page';
import { fetchPost } from '../post-requests.utils';
import { PageHeader } from '../../page-header';
import { Container } from '@nextui-org/react';
import { Post as PostType } from '../post.types';
import { PostError } from '../post-error';
import { PostsLoading } from '../posts-loading';
import { Post } from './post.component';
import { Comments } from './comments';

export const PostPage = () => {
  const { categoryId, postId } = useParams<{ categoryId: string; postId: string }>();
  const categoryQuery = useQuery([`category`, categoryId], () => fetchCategory(parseInt(categoryId ?? '')));
  const postQuery = useQuery([`posts`, categoryId, postId], () =>
    fetchPost(parseInt(categoryId ?? ''), parseInt(postId ?? '')),
  );
  return (
    <Container
      css={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 0,
        pb: '$12',
        mb: '$24',
        minHeight: 'calc(100vh - 76px)',
        '@lg': {
          width: '95%',
          maxWidth: '1440px',
          border: '1px solid black',
          borderTop: 'none',
        },
      }}
      xl
    >
      <PageHeader
        title={'Gaming Forum'}
        subtitle={categoryQuery.status === 'success' ? categoryQuery.data.title : ''}
      />
      <Container xl css={{ pt: '$12' }}>
        {getView(categoryQuery, postQuery)}
      </Container>
    </Container>
  );
};

const getView = (categoryQuery: UseQueryResult<Category, unknown>, postsQuery: UseQueryResult<PostType, unknown>) => {
  if (categoryQuery.status === 'error' || postsQuery.status === 'error') {
    return <PostError />;
  }

  if (
    categoryQuery.status === 'idle' ||
    postsQuery.status === 'idle' ||
    categoryQuery.status === 'loading' ||
    postsQuery.status === 'loading'
  ) {
    return <PostsLoading />;
  }

  return (
    <Container
      xl
      css={{
        pb: '48px',
        maxW: '960px',
        pt: '$6',
        border: '1px solid #d1d1d1',
      }}
    >
      <Post post={postsQuery.data} onChange={postsQuery.refetch} />
      <Comments postId={postsQuery.data.id} categoryId={postsQuery.data.categoryId} />
    </Container>
  );
};
