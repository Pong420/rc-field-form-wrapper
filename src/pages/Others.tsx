import React from 'react';
import {
  Classes,
  Button,
  InputGroup,
  Dialog,
  Checkbox,
  HTMLSelect,
  RadioGroup,
  Radio,
  Switch
} from '@blueprintjs/core';
import { createForm } from '../form';
import { useBoolean } from '../hooks/useBoolean';

interface Param$Others {
  nickname: string;
  checkbox: boolean;
  select: string;
  radio: string;
  switch: boolean;
  price: number;
}

const { Form, FormItem } = createForm<Param$Others>();

export function Others() {
  const [visible, setVisible] = useBoolean();

  return (
    <>
      <Button onClick={setVisible.on}>Others</Button>
      <Dialog
        className="Ohters"
        title="Ohters"
        isOpen={visible}
        onClose={setVisible.off}
      >
        <div className={Classes.DIALOG_BODY}>
          <Form
            initialValues={{
              nickname: '',
              checkbox: false,
              select: 'react',
              radio: 'buy',
              switch: true,
              price: 0
            }}
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

            <FormItem
              name="radio"
              label="Radio"
              valuePropName="selectedValue"
              getValueFromEvent={event => event.target.value}
            >
              <RadioGroup inline onChange={() => {}}>
                <Radio value="buy">Buy</Radio>
                <Radio value="sell">Sell</Radio>
              </RadioGroup>
            </FormItem>

            <FormItem name="switch" label="Switch" valuePropName="checked">
              <Switch />
            </FormItem>

            <FormItem name="price" label="Price">
              <InputGroup />
            </FormItem>

            <FormItem deps={['price']} noStyle>
              {({ price }) => <div>Discounted price: {price * 0.85}</div>}
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
