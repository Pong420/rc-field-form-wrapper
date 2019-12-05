import React, { ReactElement } from 'react';
import RcForm, { Field as RcField, FormInstance } from 'rc-field-form';
import { FormProps as RcFormProps } from 'rc-field-form/es/Form';
import { FieldProps as RcFieldProps } from 'rc-field-form/es/Field';
import { Validator, compose } from './validators';
import { FieldData } from 'rc-field-form/lib/interface';

export interface FormProps<T extends Record<string | number, any>>
  extends Omit<RcFormProps, 'onFinish'> {
  initialValues?: Partial<T>;
  onFinish?: (values: T) => void;
}

type OmititedRcFieldProps = Omit<
  RcFieldProps,
  'name' | 'dependencies' | 'children'
>;

interface BaseFieldProps<T extends {}, K extends PropertyKey = keyof T>
  extends OmititedRcFieldProps {
  name?: K | K[];
  validators?:
    | Array<Validator | null>
    | ((value: T) => Array<Validator | null>);
  validateTrigger?: string | string[];
  onReset?(): void;
}

type FieldProps<T extends {}, K extends PropertyKey = keyof T> = BaseFieldProps<
  T,
  K
> &
  (
    | {
        deps?: K[];
        children: ReactElement;
      }
    | {
        deps: K[];
        children: (value: T) => ReactElement;
      }
  );

export type FormItemProps<T extends Record<string | number, any>> = FieldProps<
  T
> & { label?: string; noStyle?: boolean };

export interface FormItemClassName {
  item?: string;
  label?: string;
  error?: string;
  touched?: string;
  validating?: string;
  help?: string;
}

type Rule = NonNullable<RcFieldProps['rules']>[number];

export function createShouldUpdate<FieldName extends string | number>(
  names: FieldName[]
): RcFieldProps['shouldUpdate'] {
  return (prev, curr) => {
    for (const name of names) {
      if (prev[name] !== curr[name]) {
        return true;
      }
    }
    return false;
  };
}

const defaultFormItemClassName: Required<FormItemClassName> = {
  item: 'rc-form-item',
  label: 'rc-form-item-label',
  error: 'rc-form-item-error',
  touched: 'rc-form-item-touched',
  validating: 'rc-form-item-validating',
  help: 'rc-form-item-help'
};

export function createForm<T extends Record<string | number, any>>({
  itemClassName,
  ...defaultProps
}: Partial<FormItemProps<T>> & { itemClassName?: FormItemClassName } = {}) {
  const FormItem = React.memo<FormItemProps<T>>(props_ => {
    const {
      children,
      rules = [],
      validators = [],
      validateTrigger,
      noStyle,
      label,
      deps,
      ...props
    } = {
      ...defaultProps,
      ...props_
    } as FormItemProps<T> & {
      deps?: Array<string | number>;
      name: string | number;
    };

    const ClassName = { ...defaultFormItemClassName, ...itemClassName };

    const _rules: Rule[] =
      typeof validators === 'function'
        ? [
            ({ getFieldsValue }) => ({
              validator: compose(validators(getFieldsValue(deps) as any))
            })
          ]
        : validators.map<Rule>(validator => ({
            validator: validator ? validator : undefined
          }));

    return React.createElement(
      RcField,
      { dependencies: [props.name] },
      (_: any, { touched, validating }: FieldData, form: FormInstance) => {
        const { getFieldError } = form;
        const errors = getFieldError(props.name);

        const field = React.createElement(
          RcField,
          {
            rules: [...rules, ..._rules],
            validateTrigger,
            dependencies: deps,
            shouldUpdate: deps && createShouldUpdate(deps),
            ...props
          },
          typeof children !== 'function'
            ? children
            : (_: any, __: FieldData, { getFieldsValue }: FormInstance) =>
                children(getFieldsValue(deps) as any)
        );

        if (noStyle) {
          return field;
        }

        return React.createElement(
          'div',
          {
            className: [
              ClassName.item,
              errors && !!errors.length ? ClassName.error : '',
              touched ? ClassName.touched : '',
              validating ? ClassName.validating : ''
            ]
              .join(' ')
              .trim()
          },
          React.createElement('label', { className: ClassName.label }, label),
          field,
          React.createElement('div', { className: ClassName.help }, errors)
        );
      }
    );
  });

  const Form = React.memo(
    React.forwardRef<FormInstance, FormProps<T>>(
      ({ children, onFinish, ...props }, ref) =>
        React.createElement(
          RcForm,
          {
            ...props,
            ref,
            onFinish: (store: any) => onFinish && onFinish(store)
          },
          children
        )
    )
  );

  return { Form, FormItem };
}
