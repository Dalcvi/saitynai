import { Avatar, Button, Col, Dropdown, Row, Text } from '@nextui-org/react';
import { Post as PostType } from '../post.types';
import { useModal } from '../../modals';
import { useUser } from '../../user';
import { PostEditModal } from '../../modals/post-edit-modal';
import { BsThreeDots } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { deletePost, editPost } from '../post-requests.utils';

export const Post = ({ post, onChange }: { post: PostType; onChange: () => void }) => {
  const { token, user, roles } = useUser();
  const openModal = useModal();
  const navigateTo = useNavigate();

  const updatePost = async (title: string, content: string, postId: number) => {
    if (!token) {
      return;
    }
    await editPost(post.categoryId, postId, title, content, token);
    onChange();
  };

  const onDelete = async (postId: number) => {
    if (!token) {
      return;
    }
    await deletePost(post.categoryId, postId, token);
    navigateTo(`/category/${post.categoryId}/posts`);
  };

  return (
    <Col css={{ minHeight: '250px' }}>
      <Row css={{ gap: '$8', display: 'flex', alignItems: 'center' }}>
        <Col css={{ gap: '$8', display: 'flex', alignItems: 'center' }}>
          <Avatar size="lg" text={post.user.username[0].toUpperCase()} />
          <Text>{post.user.username}</Text>
        </Col>
        {(roles.includes('admin') || (user.type === 'AUTHORIZED' && user.data.id === post.user.id)) && (
          <Col css={{ width: 'fit-content' }}>
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
                        <PostEditModal key={key} close={close} post={post} onSubmit={updatePost} />
                      ));
                      break;
                    case 'delete':
                      onDelete(post.id);
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
      <Row css={{ mt: '$12' }}>
        <Text h3 b size="$4xl">
          {post.title}
        </Text>
      </Row>
      <Row css={{ mt: '$6' }}>
        <Text size="$lg">{post.content}</Text>
      </Row>
    </Col>
  );
};
