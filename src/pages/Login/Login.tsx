import React from 'react';
import { Card, Button, InputGroup } from '@blueprintjs/core';
import { createForm, validators } from '../../form';
import { ReactComponent as Logo } from '../../assets/logo.svg';

interface Param$Login {
  username: string;
  password: string;
}

const { Form, FormItem } = createForm<Param$Login>();

export function Login() {
  return (
    <div className="login">
      <Card className="login-card" elevation={3}>
        <div className="login-card-header">
          <Logo />
        </div>
        <div className="login-card-body">
          <Form
            initialValues={{ username: '', password: '' }}
            onFinish={console.log}
          >
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
              validators={[
                validators.required('Please input password'),
                validators.passwordFormat(
                  'Password must include english and number'
                )
              ]}
            >
              <InputGroup type="password" />
            </FormItem>
            <Button fill type="submit" intent="primary">
              Login
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  );
}
