## rc-field-form

Wrapper of [react-component/field-form](https://github.com/react-component/field-form), inspired by [Antd 4.0 Form Component](https://next.ant.design/components/form/?locale=en-US#header)

## Features

- Stronger Type Checking
  - initialValues, onFinish, name, deps
- Label and error text handled
- Easier options
- Validators

## Install

Copy the files in `src/form` to your project

## Usage

```tsx
import { createForm, validators } from '../form';

interface Param$Login {
  username: string;
  password: string;
}

const { Form, FormItem } = createForm<Param$Login>();

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

## Changed API

## Form

| Prop          | Changes                |
| ------------- | ---------------------- |
| initialValues | Better type defination |
| onFinish      | Better type defination |

## FormItem (Field)

| Prop         | Changes                                                           | Type                                   |
| ------------ | ----------------------------------------------------------------- | -------------------------------------- |
| dependencies | Reaplced by `deps`                                                | ---                                    |
| deps         | Same as dependencies, better type defination                      | string[]                               |
| validators   | Similar to `rules` validator                                      | Validator[] \| (values) => Validator[] |
| shouldUpdate | If `deps` added, it will assign `shouldUpdate` prop automatically |
| label        | Form label                                                        | string                                 |
| noStyle      | used as a pure field control                                      | boolean                                |

## Recipes

### validators

- Validator is a function return Promise, and reject an string if incorrect. more details see [src/form/validators.ts](./src/form/validators.ts)

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

```ts
const { Form, FormItem } = createForm({
  // ...formitem props
});
```
