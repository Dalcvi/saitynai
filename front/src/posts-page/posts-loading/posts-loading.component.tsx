import { Loading, Row } from '@nextui-org/react';

export const PostsLoading = () => {
  return (
    <Row css={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px' }}>
      <Loading size="xl" />
    </Row>
  );
};
