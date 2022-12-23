import { Button, Card, Col, Dropdown, Row, Text } from '@nextui-org/react';
import { Category } from '../category.types';
import { useNavigate } from 'react-router-dom';
import { deleteCategory, editCategory } from '../category-requests.utils.ts';
import { useUser } from '../../user';
import { BsThreeDots } from 'react-icons/bs';
import { useModal } from '../../modals';
import { CategoryEditModal } from '../../modals/category-edit-modal';

export const CategoryList = ({ categories, onChange }: { categories: Category[]; onChange: () => void }) => {
  const navigateTo = useNavigate();
  const { token, roles } = useUser();
  const openModal = useModal();

  const updateCategory = async (title: string, description: string, categoryId: number) => {
    if (!token) {
      return;
    }
    await editCategory(categoryId, title, description, token);
    onChange();
  };

  const onDelete = async (categoryId: number) => {
    if (!token) {
      return;
    }
    await deleteCategory(categoryId, token);
    onChange();
  };

  return (
    <>
      {categories.map((category) => (
        <Card
          css={{ mt: '$12' }}
          variant="bordered"
          isHoverable
          isPressable
          onPress={() => {
            navigateTo(`/category/${category.id}/posts`);
          }}
          key={category.id}
        >
          <Card.Body>
            <Row>
              <Col>
                <Row>
                  <Text size="$2xl">{category.title}</Text>
                </Row>
                <Row css={{ mt: '$2' }}>
                  <Text size="$sm" color="grey">
                    {category.description}
                  </Text>
                </Row>
              </Col>
              {roles.includes('admin') && (
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
                              <CategoryEditModal
                                key={key}
                                close={close}
                                category={category}
                                onSubmit={updateCategory}
                              />
                            ));
                            break;
                          case 'delete':
                            onDelete(category.id);
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
          </Card.Body>
        </Card>
      ))}
    </>
  );
};
