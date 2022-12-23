import { Button, Input, Loading, Modal, Text } from '@nextui-org/react';
import { useState } from 'react';

export const CategoryCreateModal = ({
  close,
  onSubmit,
}: {
  close: () => void;
  onSubmit: (title: string, description: string) => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit(title, content);
    setIsLoading(false);
    close();
  };

  return (
    <Modal open={true} onClose={close} width="fit-content">
      <Modal.Header>
        <Text b size={18}>
          Create a category
        </Text>
      </Modal.Header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Input
          bordered
          type="text"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          css={{ maxWidth: '400px', p: '$4', width: '100%' }}
        />
        <Input
          bordered
          label="Description"
          css={{ p: '$4', maxWidth: '400px', width: '100%' }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Modal.Footer>
          <Button type="submit" disabled={content.length === 0 || title.length === 0}>
            {isLoading ? <Loading size="xs" /> : 'Create'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
