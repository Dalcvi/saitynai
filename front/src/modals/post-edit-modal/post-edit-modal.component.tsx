import { useState } from 'react';
import { Button, Input, Loading, Modal, Text, Textarea } from '@nextui-org/react';
import { Post } from '../../posts-page/post.types';

export const PostEditModal = ({
  close,
  post,
  onSubmit,
}: {
  close: () => void;
  post: Post;
  onSubmit: (title: string, content: string, postId: number) => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit(title, content, post.id);
    setIsLoading(false);
    close();
  };

  return (
    <Modal open={true} onClose={close} width="fit-content">
      <Modal.Header>
        <Text b size={18}>
          Edit post
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
        <Textarea
          bordered
          label="Content"
          css={{ p: '$4', maxWidth: '400px', width: '100%' }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Modal.Footer>
          <Button
            type="submit"
            disabled={content.length === 0 || title.length === 0 || (title === post.title && content === post.content)}
          >
            {isLoading ? <Loading size="xs" /> : 'Edit'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
