import { Button, Input, Link, Loading, Modal, Row, Text } from '@nextui-org/react';
import { useState } from 'react';
import { getPasswordError, useAge, useEmail, useName, usePassword, getAgeError } from '../input-logic';
import { LoginModal } from '../login-modal';
import { useModal } from '../use-modal.hook';

export const RegisterModal = ({ close }: { close: () => void }) => {
  const [email, setEmail, isEmailValid, isEmailEmpty, isTypingEmail] = useEmail();
  const [password, setPassword, isPasswordValid, isPasswordEmpty, isTypingPassword] = usePassword();
  const [username, setUsername, isUsernameValid, isUsernameEmpty, isTypingUsername] = useName();
  const [isLoading, setIsLoading] = useState(false);
  const openModal = useModal();

  const isAnyValueEmpty = isEmailEmpty || isPasswordEmpty || isUsernameEmpty;
  const isAnyDataInvalid = !isEmailValid || !isPasswordValid || !isUsernameValid;
  const isTypingAnyInput = isTypingEmail || isTypingPassword || isTypingUsername;

  console.log(isAnyValueEmpty, isAnyDataInvalid, isTypingAnyInput);
  const disableSubmit = isAnyDataInvalid || isAnyValueEmpty || isTypingAnyInput || isLoading;

  const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disableSubmit) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/auth/register`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'manual',
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      if (response.status >= 400) {
        throw new Error();
      }
      setIsLoading(false);
      openModal((close, key) => <LoginModal close={close} key={key} />);
      close();
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={true} onClose={close}>
      <Modal.Header>
        <Text b size={18}>
          Register
        </Text>
      </Modal.Header>
      <form onSubmit={onRegister}>
        <Modal.Body>
          <Input
            bordered
            fullWidth
            aria-label="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            status={isEmailValid || isEmailEmpty ? 'primary' : 'error'}
            size="lg"
            placeholder="Email"
          />
          <Input
            bordered
            fullWidth
            type="text"
            aria-label="Username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            status={isUsernameValid || isUsernameEmpty ? 'primary' : 'error'}
            size="lg"
            placeholder="Username"
          />
          <Input.Password
            bordered
            fullWidth
            aria-label="Password"
            status={isPasswordValid || isPasswordEmpty ? 'primary' : 'error'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="lg"
            type="password"
            placeholder="Password"
            css={{
              marginBottom: isPasswordValid ? '16px' : '6px',
            }}
          />
          {!isPasswordValid && getPasswordError(password) !== undefined && (
            <Row
              css={{
                marginBottom: '6px',
              }}
            >
              <Text size={12} color="error">
                {getPasswordError(password)}
              </Text>
            </Row>
          )}
          <Row>
            <Text size={16}>
              Already have an account?{' '}
              <Link
                href="#"
                css={{ display: 'inline' }}
                onClick={() => {
                  close();
                  openModal((close, key) => <LoginModal close={close} key={key} />);
                }}
              >
                Log In
              </Link>
            </Text>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={close}>
            Close
          </Button>
          <Button auto type="submit" disabled={disableSubmit}>
            {isLoading ? <Loading type="points" color="currentColor" size="sm" /> : 'Sign up'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
