import { Container, Divider, Text } from '@nextui-org/react';

export const PageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <Container
      as="header"
      xl
      css={{
        width: '100%',
        background: '$gradient',
        height: '240px',
        m: 0,
        p: 0,
        borderBottom: '1px solid black',
        flexDirection: 'column',
        gap: '$2',
      }}
      alignItems="center"
      justify="center"
      display="flex"
    >
      <Text
        h2
        color="$white"
        css={{
          margin: 0,
          padding: 0,
          fontSize: '$3xl',
          '@xs': {
            fontSize: '$6xl',
          },
        }}
      >
        {title}
      </Text>
      <Text
        h2
        color="$white"
        css={{
          margin: 0,
          padding: 0,
          fontSize: '$lg',
          '@xs': {
            fontSize: '$2xl',
          },
        }}
      >
        {subtitle}
      </Text>
    </Container>
  );
};
