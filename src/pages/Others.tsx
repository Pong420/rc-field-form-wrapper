import React from 'react';
import {
  Classes,
  Button,
  InputGroup,
  Dialog,
  Checkbox,
  HTMLSelect,
  RadioGroup,
  Radio
} from '@blueprintjs/core';
import { createForm } from '../form';
import { useBoolean } from '../hooks/useBoolean';

interface Param$Others {
  nickname: string;
  checkbox: boolean;
  select: string;
  radio: string;
}

const { Form, FormItem } = createForm<Param$Others>();

export function Others() {
  const [visible, setVisible] = useBoolean();

  return (
    <>
      <Button onClick={setVisible.on}>Others</Button>
      <Dialog
        className="login"
        title="Login"
        isOpen={visible}
        onClose={setVisible.off}
      >
        <div className={Classes.DIALOG_BODY}>
          <Form
            initialValues={{ nickname: '', checkbox: false, select: 'react' }}
            onFinish={console.log}
          >
            <FormItem name="nickname" label="Nick Name">
              <InputGroup />
            </FormItem>

            <FormItem name="checkbox" label="CheckBox" valuePropName="checked">
              <Checkbox />
            </FormItem>

            <FormItem name="select" label="Select">
              <HTMLSelect>
                <option value="vue">Vue</option>
                <option value="react">React</option>
                <option value="angular">Angular</option>
              </HTMLSelect>
            </FormItem>

            <FormItem name="radio" label="Radio">
              <RadioGroup onChange={() => {}}>
                <Radio value="buy">Buy</Radio>
                <Radio value="sell">Sell</Radio>
              </RadioGroup>
            </FormItem>

            <Button fill type="submit" intent="primary">
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
