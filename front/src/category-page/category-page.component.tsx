import { Button, Card, Container, Row, Text } from '@nextui-org/react';
import { UseQueryResult, useQuery } from 'react-query';
import { fetchCategories, postCategory } from './category-requests.utils.ts';
import { CategoryList } from './category-list';
import { PageHeader } from '../page-header';
import { GetCategoryRequest } from './category.types';
import { CategoriesLoading } from './categories-loading';
import { CategoryError } from './category-error';
import { useModal } from '../modals';
import { useUser } from '../user';
import { CategoryCreateModal } from '../modals/category-create-modal';

export const CategoryPage = () => {
  const { token, roles } = useUser();
  const categoriesQuery = useQuery('categories', fetchCategories);
  const openModal = useModal();

  const createCategory = async (title: string, description: string) => {
    if (!token) {
      return;
    }
    await postCategory(title, description, token);
    categoriesQuery.refetch();
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
      <PageHeader title={'Gaming Forum'} subtitle={'Categories'} />
      <Container xl css={{ pt: '$12' }}>
        {roles.includes('admin') && (
          <Row justify="flex-end">
            <Button
              onClick={() => {
                openModal((close, key) => <CategoryCreateModal key={key} close={close} onSubmit={createCategory} />);
              }}
            >
              Create category
            </Button>
          </Row>
        )}
        {getView(categoriesQuery)}
      </Container>
    </Container>
  );
};

const getView = (query: UseQueryResult<GetCategoryRequest, unknown>) => {
  switch (query.status) {
    case 'idle':
    case 'loading':
      return <CategoriesLoading />;
    case 'success':
      return <CategoryList categories={query.data.items} onChange={query.refetch} />;
    default:
      return <CategoryError />;
  }
};
