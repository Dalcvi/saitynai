import { Loading, Row } from '@nextui-org/react';

export const CategoriesLoading = () => {
  return (
    <Row css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px' }}>
      <Loading size="xl" />
    </Row>
  );
};
