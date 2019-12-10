import React from 'react';
import { Classes, Button, InputGroup, Dialog } from '@blueprintjs/core';
import { createForm, validators } from '../form';
import { useBoolean } from '../hooks/useBoolean';
import { useFakeRequest } from '../hooks/useFakeRequest';

interface Param$ModifyPassword {
  old_passwrod: string;
  new_password: string;
  confirm_new_password: string;
  price: number;
}

const { Form, FormItem } = createForm<Param$ModifyPassword>();

export function ModifyPassword() {
  const [visible, setVisible] = useBoolean();
  const { loading, run } = useFakeRequest();

  return (
    <>
      <Button onClick={setVisible.on}>Modify Password</Button>
      <Dialog
        className="modify-password"
        title="Modify Password"
        isOpen={visible}
        onClose={setVisible.off}
      >
        <div className={Classes.DIALOG_BODY}>
          <Form
            initialValues={{
              old_passwrod: '',
              new_password: '',
              confirm_new_password: ''
            }}
            onFinish={run}
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
              deps={['old_passwrod']}
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
              deps={['new_password']}
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

            <Button fill type="submit" intent="primary" loading={loading}>
              Confirm
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
