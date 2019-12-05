import React from 'react';
import { Classes, Button, InputGroup, Dialog } from '@blueprintjs/core';
import { createForm, validators } from '../form';
import { useBoolean } from '../hooks/useBoolean';
import { useFakeRequest } from '../hooks/useFakeRequest';

interface Param$Login {
  username: string;
  password: string;
}

const { Form, FormItem } = createForm<Param$Login>();

export function Login() {
  const [visible, setVisible] = useBoolean();
  const { loading, run } = useFakeRequest();

  return (
    <>
      <Button onClick={setVisible.on}>Login Form</Button>
      <Dialog
        className="login"
        title="Login"
        isOpen={visible}
        onClose={setVisible.off}
      >
        <div className={Classes.DIALOG_BODY}>
          <Form initialValues={{ username: '', password: '' }} onFinish={run}>
            <FormItem
              name="username"
              label="Username"
              validators={[validators.required('Please input username')]}
            >
              <InputGroup />
            </FormItem>
            <FormItem
              name="password"
              label="Password"
              validators={[validators.required('Please input password')]}
            >
              <InputGroup type="password" />
            </FormItem>

            <Button fill type="submit" intent="primary" loading={loading}>
              Login
            </Button>

            <Button fill type="submit" onClick={setVisible.off}>
              Cancel
            </Button>
          </Form>
        </div>
      </Dialog>
    </>
  );
}
