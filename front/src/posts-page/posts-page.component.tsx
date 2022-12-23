import { Button, Container, Row } from '@nextui-org/react';
import { UseQueryResult, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { fetchCategory } from '../category-page';
import { Category } from '../category-page/category.types';
import { PageHeader } from '../page-header';
import { PostError } from './post-error';
import { PostList } from './post-list';
import { fetchPosts, postPost } from './post-requests.utils';
import { GetPostRequest } from './post.types';
import { PostsLoading } from './posts-loading';
import { useUser } from '../user';
import { useModal } from '../modals';
import { PostCreateModal } from '../modals/post-create-modal';

export const PostsPage = () => {
  const { token, user } = useUser();
  const openModal = useModal();
  const { categoryId } = useParams<{ categoryId: string }>();
  const categoryQuery = useQuery([`category`, categoryId], () => fetchCategory(parseInt(categoryId ?? '')));
  const postsQuery = useQuery([`posts`, categoryId], () => fetchPosts(parseInt(categoryId ?? '')));

  const createPost = async (title: string, content: string) => {
    if (!token || !categoryId) {
      return;
    }
    await postPost(parseInt(categoryId), title, content, token);
    postsQuery.refetch();
  };

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
        {categoryQuery.status === 'success' && user.type === 'AUTHORIZED' && (
          <Row justify="flex-end">
            <Button
              onClick={() => {
                openModal((close, key) => <PostCreateModal key={key} close={close} onSubmit={createPost} />);
              }}
            >
              Create post
            </Button>
          </Row>
        )}
        {getView(categoryQuery, postsQuery)}
      </Container>
    </Container>
  );
};

const getView = (
  categoryQuery: UseQueryResult<Category, unknown>,
  postsQuery: UseQueryResult<GetPostRequest, unknown>,
) => {
  console.log(postsQuery.status, categoryQuery.status);
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

  return <PostList posts={postsQuery.data.items} categoryId={categoryQuery.data.id} onChange={postsQuery.refetch} />;
};
