import { Avatar, Button, Col, Divider, Dropdown, Loading, Row, Spacer, Text, Textarea } from '@nextui-org/react';
import { useQuery } from 'react-query';
import { deleteComment, editComment, fetchComments, postComment } from './comments-requests.utils';
import { CommentsLoading } from './comments-loading';
import { CommentsError } from './comments-error';
import { useUser } from '../../../user';
import { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { useModal } from '../../../modals';
import { CommentEditModal } from '../../../modals/comment-edit-modal';

export const Comments = ({ categoryId, postId }: { categoryId: number; postId: number }) => {
  const { token, user, roles } = useUser();
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const openModal = useModal();
  const commentsQuery = useQuery([`comments`, categoryId, postId], () => fetchComments(categoryId, postId));

  if (commentsQuery.status === 'idle' || commentsQuery.status === 'loading') {
    return <CommentsLoading />;
  }

  if (commentsQuery.status === 'error') {
    return <CommentsError />;
  }

  const createComment = async () => {
    if (!token) {
      return;
    }
    setIsLoading(true);
    await postComment(categoryId, postId, comment, token);
    setComment('');
    commentsQuery.refetch();
    setIsLoading(false);
  };

  const updateComment = async (content: string, commentId: number) => {
    if (!token) {
      return;
    }

    await editComment(categoryId, postId, commentId, content, token);
    commentsQuery.refetch();
  };

  const onDelete = async (commentId: number) => {
    if (!token) {
      return;
    }
    await deleteComment(categoryId, postId, commentId, token);
    commentsQuery.refetch();
  };

  return (
    <>
      <Row>
        <Text h4 size="$2xl">
          Comments ({commentsQuery.data.metadata.totalCount})
        </Text>
      </Row>
      <Row css={{ mt: '$6' }}>
        <Textarea
          size="lg"
          placeholder="Share your opinion..."
          bordered
          css={{ width: '100%', minHeight: '60px', font: 'Roboto' }}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Row>
      <Row css={{ display: 'flex', justifyContent: 'flex-end', gap: '$12', mt: '$6' }}>
        <Button auto disabled={user.type !== 'AUTHORIZED' || comment.length === 0} onClick={createComment}>
          {isLoading ? <Loading size="xs" /> : 'Submit'}
        </Button>
      </Row>
      <Spacer y={1} />
      <Divider />
      <Spacer y={2} />
      {commentsQuery.data.items.length === 0 && (
        <Row css={{ display: 'flex', height: '60px', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          Currently there are no comments :(
        </Row>
      )}
      {commentsQuery.data.items.map((comment) => (
        <>
          <Spacer y={1} />
          <Row
            css={{ gap: '$6', justifyContent: 'space-between', display: 'flex', width: '100%', alignItems: 'center' }}
          >
            <Col css={{ gap: '$6', display: 'flex' }}>
              <Avatar size="xs" text={comment.user.username[0].toUpperCase()} />
              <Text>{comment.user.username}</Text>
            </Col>
            {(roles.includes('admin') || (user.type === 'AUTHORIZED' && user.data.id === comment.user.id)) && (
              <Col css={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Dropdown>
                  <Dropdown.Trigger css={{ border: 'none' }}>
                    <Button auto rounded bordered css={{ border: 'none' }} onClick={() => {}}>
                      <BsThreeDots />
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Menu
                    onAction={(key) => {
                      switch (key) {
                        case 'edit':
                          openModal((close, key) => (
                            <CommentEditModal key={key} close={close} comment={comment} onSubmit={updateComment} />
                          ));
                          break;
                        case 'delete':
                          onDelete(comment.id);
                          break;
                        default:
                          throw new Error('Unreachable');
                      }
                    }}
                  >
                    <Dropdown.Item key="edit">Edit</Dropdown.Item>
                    <Dropdown.Item key="delete">Delete</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            )}
          </Row>
          <Row css={{ mt: '$6' }}>
            <Text size="$lg">{comment.content}</Text>
          </Row>
          <Spacer y={1} />

          <Divider />
        </>
      ))}
    </>
  );
};
