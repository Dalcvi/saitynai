import { Row, Text } from '@nextui-org/react';

export const CategoryError = () => {
  return (
    <Row css={{ display: 'flex', justifyContent: 'center' }}>
      <Text>Sorry, failed to fetch categories. Try again later</Text>
    </Row>
  );
};
