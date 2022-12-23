import { Row, Text } from '@nextui-org/react';

export const PostError = () => {
  return (
    <Row css={{ display: 'flex', justifyContent: 'center' }}>
      <Text>Sorry, failed to fetch posts. Try again later</Text>
    </Row>
  );
};
