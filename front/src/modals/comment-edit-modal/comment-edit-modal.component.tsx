import { useState } from 'react';
import { Comment } from '../../posts-page/post-page/comments/comments.types';
import { Button, Loading, Modal, Text, Textarea } from '@nextui-org/react';

export const CommentEditModal = ({
  close,
  comment,
  onSubmit,
}: {
  close: () => void;
  comment: Comment;
  onSubmit: (content: string, commentId: number) => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(comment.content);

  const handleSubmit = async () => {
    setIsLoading(true);
    console.log('WHAT');
    await onSubmit(content, comment.id);
    setIsLoading(false);
    close();
  };

  return (
    <Modal open={true} onClose={close} width="fit-content">
      <Modal.Header>
        <Text b size={18}>
          Edit comment
        </Text>
      </Modal.Header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Textarea
          label="Comment"
          bordered
          css={{ p: '$4', maxWidth: '400px', width: '100%' }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Modal.Footer>
          <Button type="submit" disabled={content.length === 0 || content === comment.content}>
            {isLoading ? <Loading size="xs" /> : 'Edit'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
