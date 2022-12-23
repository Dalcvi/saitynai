import { Avatar, Button, Card, Col, Dropdown, Row, Text } from '@nextui-org/react';
import { Post } from '../post.types';
import { Link, useNavigate } from 'react-router-dom';
import { BsThreeDots } from 'react-icons/bs';
import { useModal } from '../../modals';
import { useUser } from '../../user';
import { deletePost, editPost } from '../post-requests.utils';
import { PostEditModal } from '../../modals/post-edit-modal';

export const PostList = ({
  posts,
  categoryId,
  onChange,
}: {
  posts: Post[];
  categoryId: number;
  onChange: () => void;
}) => {
  const navigateTo = useNavigate();
  const { token, user, roles } = useUser();
  const openModal = useModal();

  const updatePost = async (title: string, content: string, postId: number) => {
    if (!token) {
      return;
    }
    await editPost(categoryId, postId, title, content, token);
    onChange();
  };

  const onDelete = async (postId: number) => {
    if (!token) {
      return;
    }
    await deletePost(categoryId, postId, token);
    onChange();
  };

  return (
    <>
      {posts.map((post) => (
        <Card
          css={{ mt: '$12' }}
          variant="bordered"
          isHoverable
          isPressable
          onPress={() => {
            navigateTo(`/category/${post.categoryId}/posts/${post.id}`);
          }}
          key={post.id}
        >
          <Card.Body>
            <Row css={{ display: 'flex', alignItems: 'center' }}>
              <Col css={{ display: 'flex', alignItems: 'center' }}>
                <Text as={Link} size="$2xl">
                  {post.title}
                </Text>
              </Col>
              <Col css={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '$8' }}>
                <Col css={{ display: 'flex', alignItems: 'center', gap: '$6', justifyContent: 'flex-end' }}>
                  <Text>{post.user.username}</Text>
                  <Avatar text={post.user.username[0].toUpperCase()} />
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
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};
