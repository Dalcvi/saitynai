import { Button, Input, Loading, Modal, Text } from '@nextui-org/react';
import { useState } from 'react';
import { Category } from '../../category-page';

export const CategoryEditModal = ({
  close,
  category,
  onSubmit,
}: {
  close: () => void;
  category: Category;
  onSubmit: (title: string, content: string, categoryId: number) => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(category.title);
  const [content, setContent] = useState(category.description);

  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit(title, content, category.id);
    setIsLoading(false);
    close();
  };

  return (
    <Modal open={true} onClose={close} width="fit-content">
      <Modal.Header>
        <Text b size={18}>
          Edit category
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
          label="Title"
          type="text"
          css={{ maxWidth: '400px', p: '$4', width: '100%' }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          bordered
          label="Description"
          css={{ p: '$4', maxWidth: '400px', width: '100%' }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Modal.Footer>
          <Button
            type="submit"
            disabled={
              content.length === 0 ||
              title.length === 0 ||
              (title === category.title && content === category.description)
            }
          >
            {isLoading ? <Loading size="xs" /> : 'Edit'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
