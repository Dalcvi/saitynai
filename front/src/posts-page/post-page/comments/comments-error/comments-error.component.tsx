import { Row, Text } from '@nextui-org/react';

export const CommentsError = () => {
  return (
    <Row css={{ display: 'flex', justifyContent: 'center' }}>
      <Text>Sorry, failed to fetch comments. Try again later</Text>
    </Row>
  );
};
