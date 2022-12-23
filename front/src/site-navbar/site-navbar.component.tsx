import { Avatar, Button, Dropdown, Navbar, Text } from '@nextui-org/react';
import { useLocation, Link } from 'react-router-dom';
import { LoginModal, RegisterModal, useModal } from '../modals';
import { useUser } from '../user';

export const SiteNavbar = () => {
  const currentLocation = useLocation();
  const openModal = useModal();
  const { user, logout } = useUser();

  return (
    <Navbar isBordered variant="sticky">
      <Navbar.Brand>
        <Text b color="inherit">
          GAMERS
        </Text>
      </Navbar.Brand>
      <Navbar.Content enableCursorHighlight hideIn="xs" variant="underline">
        <Navbar.Link as={Link} to="/" isActive={currentLocation.pathname === '/'}>
          Categories
        </Navbar.Link>
        {user.type === 'AUTHORIZED' ? (
          <Dropdown>
            <Dropdown.Trigger>
              <Avatar
                bordered
                as="button"
                color="secondary"
                text={user.data.username[0].toUpperCase()}
                textColor="white"
              />
            </Dropdown.Trigger>
            <Dropdown.Menu
              onAction={(key) => {
                switch (key) {
                  case 'logout':
                    logout();
                    break;
                  default:
                    throw new Error('Unreachable');
                }
              }}
              color="secondary"
              aria-label="Profile actions"
            >
              <Dropdown.Item key="logout" aria-label="Logout">
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <>
            <Button
              auto
              bordered
              onClick={() => {
                openModal((close, key) => <LoginModal close={close} key={key} />);
              }}
            >
              Login
            </Button>
            <Button
              auto
              flat
              onClick={() => {
                openModal((close, key) => <RegisterModal close={close} key={key} />);
              }}
              shadow
            >
              Sign Up
            </Button>
          </>
        )}
      </Navbar.Content>
      <Navbar.Content showIn={'xs'}>
        <Navbar.Toggle aria-label="toggle navigation" />
      </Navbar.Content>
      <Navbar.Collapse showIn={'xs'}>
        <Navbar.CollapseItem>
          <Link to="/">Categories</Link>
        </Navbar.CollapseItem>
        {user.type === 'AUTHORIZED' ? (
          <Navbar.CollapseItem>
            <Button
              bordered
              onClick={() => {
                logout();
              }}
            >
              Logout
            </Button>
          </Navbar.CollapseItem>
        ) : (
          <>
            <Navbar.CollapseItem>
              <Button
                bordered
                onClick={() => {
                  openModal((close, key) => <LoginModal close={close} key={key} />);
                }}
              >
                Login
              </Button>
            </Navbar.CollapseItem>
            <Navbar.CollapseItem>
              <Button
                flat
                shadow
                onClick={() => {
                  openModal((close, key) => <RegisterModal close={close} key={key} />);
                }}
              >
                Sign Up
              </Button>
            </Navbar.CollapseItem>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};
