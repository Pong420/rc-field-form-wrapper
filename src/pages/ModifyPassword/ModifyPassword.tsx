import React from 'react';
import { Card, Button, InputGroup } from '@blueprintjs/core';
import { createForm, validators } from '../../form';
import { ReactComponent as Logo } from '../../assets/logo.svg';

interface Param$ModifyPassword {
  old_passwrod: string;
  new_password: string;
  confirm_new_password: string;
}

const { Form, FormItem } = createForm<Param$ModifyPassword>();

export function ModifyPassword() {
  return (
    <div className="modify-password">
      <Card className="modify-password-card" elevation={3}>
        <div className="modify-password-card-header">
          <Logo />
        </div>
        <div className="modify-password-card-body">
          <Form
            initialValues={{
              old_passwrod: '',
              new_password: '',
              confirm_new_password: ''
            }}
            onFinish={console.log}
          >
            <FormItem
              name="old_passwrod"
              label="Old Password"
              validators={[
                validators.required('Please input your old password')
              ]}
            >
              <InputGroup />
            </FormItem>

            <FormItem
              name="new_password"
              label="New Password"
              validators={({ old_passwrod }) => [
                validators.required('Please input the new password'),
                validators.minLength(8, 'Password should not less then 8'),
                validators.maxLength(20, 'Password should not more then 20'),
                validators.passwordFormat(
                  'Password must include english and number'
                ),
                validators.shouldNotBeEqual(
                  old_passwrod,
                  'Password should not be equal to old password'
                )
              ]}
            >
              <InputGroup />
            </FormItem>

            <FormItem
              name="confirm_new_password"
              label="Confirm New Password"
              validators={({ new_password }) => [
                validators.required('Please input password'),
                validators.shouldBeEqual(
                  new_password,
                  'Not the same as above new password'
                )
              ]}
            >
              <InputGroup />
            </FormItem>

            <Button fill type="submit" intent="primary">
              Confirm
            </Button>
          </Form>
        </div>
      </Card>
    </div>
  );
}
