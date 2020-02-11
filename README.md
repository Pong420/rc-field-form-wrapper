## rc-field-form

Wrapper of [react-component/field-form](https://github.com/react-component/field-form), inspired by [Antd 4.0 Form Component](https://next.ant.design/components/form/?locale=en-US#header)

:warning: Before using this, you should have basic understanding of above libarary

## Features

- Stronger Type Checking on
  - initialValues, onFinish, name, deps ...
- Validators
- Label and error text ( you will need to customize the style yourself )

## Install

Copy the files in `src/form` to your project

## Usage

```tsx
import { createForm, validators, FormInstance, FormItemProps } from '../form';

interface Param$Login {
  username: string;
  password: string;
}

const { Form, FormItem, useForm } = createForm<Param$Login>();

// it is suggested to set initialValues, otherwise you may receive an error when values change
<Form initialValues={{ username: '', password: '' }} onFinish={console.log}>
  <FormItem
    name="username"
    label="Username"
    validators={[validators.required('Please input username')]}
  >
    <input />
  </FormItem>

  {/* //... */}

  <button type="submit">Submit</button>
</Form>;
```

[Demo](https://rc-field-form.herokuapp.com/)

## API Difference

## Form

| Prop                    | Changes                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------ |
| initialValues           | Better type intelligence                                                             |
| onFinish                | Better type intelligence                                                             |
| beforeSubmit            | (store: Store) => Values, transform `form values` before pass to `onFinish` callback |
| transoformInitialValues | (store: Values) => Store, transform `initialValues` before initialize                |

## FormItem (Field)

| Prop         | Changes                                                                                  | Type                                   |
| ------------ | ---------------------------------------------------------------------------------------- | -------------------------------------- |
| dependencies | Replaced by `deps`                                                                       | ---                                    |
| deps         | Same as dependencies, but better type intelligence                                       | string[]                               |
| validators   | Similar to `rules` validator                                                             | Validator[] \| (values) => Validator[] |
| shouldUpdate | You may not need this props. If `deps` is assigned, this props will create automatically | ---                                    |
| label        | Form label                                                                               | string                                 |
| noStyle      | used as a pure field control (label/error will not be renreder)                          | boolean                                |

## Recipes

### validation

- Validator is a function return Promise, and reject a string if incorrect. For more details see [src/form/validators.ts](./src/form/validators.ts)

```ts
import { Validator, HigherOrderValidator } from '../form';
const customValidator: Validator = (rule, value) => {
  if (value) {
    return Promise.resolve();
  }
  return Promise.reject('error');
};
```

- `validators` can be a function that return array of validator, it is useful if the validation rely on other field's value. For example validation of new password

```tsx
<FormItem
  name="new_password"
  label="New Password"
  validators={({ old_passwrod }) => [
    validators.required('Please input the new password'),
    validators.minLength(8, 'Password should not less then 8'),
    validators.maxLength(20, 'Password should not more then 20'),
    validators.passwordFormat('Password must include english and number'),
    validators.shouldNotBeEqual(
      old_passwrod,
      'Password should not be equal to old password'
    )
  ]}
>
  <InputGroup />
</FormItem>
```

### component className / noStyle

- custom class name

```ts
const { Form, FormItem } = createForm({
  itemClassName: {
    item: 'rc-form-item',
    label: 'rc-form-item-label',
    error: 'rc-form-item-error',
    touched: 'rc-form-item-touched',
    validating: 'rc-form-item-validating',
    help: 'rc-form-item-help'
  }
});
```

- noStyle options, if you have a component rely on field value

```tsx
<FormItem deps={['price']} noStyle>
  {({ price }) => <div>Discounted price: {price * 0.85}</div>}
</FormItem>
```

### defaultProps

You can set default props for all `FormItem`

```ts
const span = 6;
const { Form, FormItem, useForm } = createForm<Schema>({
  labelCol: { span },
  wrapperCol: { span: 24 - span }
});
```

### Tranform form values befoe initialize or submit

```tsx
interface Store {
  a: number;
  b: number;
}

interface Values {
  tuple: [number, number];
}

const { Form, FormItem, useForm } = createForm<Store, Values>();

function beforeSubmit({ tuple }: Partial<Values>): Partial<Store> {
  return {
    a: tuple[0],
    b: tuple[1]
  };
}

function transoformInitialValues({ a, b }: Store): Values {
  return {
    tuple: [a, b]
  };
}

function FormComponent() {
  return <Form></Form>;
}
```
