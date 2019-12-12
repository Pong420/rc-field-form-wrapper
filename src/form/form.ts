import React, { ReactElement } from 'react';
import RcForm, { Field as RcField, useForm as RcUseForm } from 'rc-field-form';
import { FormProps as RcFormProps } from 'rc-field-form/es/Form';
import { FieldProps as RcFieldProps } from 'rc-field-form/es/Field';
import { Validator, compose } from './validators';
import {
  FieldData,
  FieldError,
  ValidateFields,
  Store
} from 'rc-field-form/lib/interface';

export type ValueOf<T> = T[keyof T];

type NamePath<K extends PropertyKey> = K | K[];

export type FormInstance<T extends {} = {}, K extends keyof T = keyof T> = {
  getFieldValue: (name: NamePath<K>) => T[K];
  getFieldsValue: (nameList?: NamePath<K>[]) => T;
  getFieldError: (name: NamePath<K>) => string[];
  getFieldsError: (nameList?: NamePath<K>[]) => FieldError[];
  isFieldsTouched(
    nameList?: NamePath<K>[],
    allFieldsTouched?: boolean
  ): boolean;
  isFieldsTouched(allFieldsTouched?: boolean): boolean;
  isFieldTouched: (name: NamePath<K>) => boolean;
  isFieldValidating: (name: NamePath<K>) => boolean;
  isFieldsValidating: (nameList: NamePath<K>[]) => boolean;
  resetFields: (fields?: NamePath<K>[]) => void;
  setFields: (fields: FieldData[]) => void;
  setFieldsValue: (value: T) => void;
  validateFields: ValidateFields;
  submit: () => void;
};

export interface FormProps<T extends {} = Store>
  extends Omit<RcFormProps, 'form' | 'onFinish'> {
  form?: FormInstance<T>;
  initialValues?: Partial<T>;
  onFinish?: (values: T) => void;
}

type OmititedRcFieldProps = Omit<
  RcFieldProps,
  'name' | 'dependencies' | 'children'
>;

interface BasicFormItemProps<T extends {}, K extends keyof T = keyof T>
  extends OmititedRcFieldProps {
  name?: K | K[];
  children?: ReactElement | ((value: T) => ReactElement);
  validators?:
    | Array<Validator | null>
    | ((value: T) => Array<Validator | null>);
  validateTrigger?: string | string[];
  onReset?(): void;
  label?: string;
  noStyle?: boolean;
}

type FormItemPropsDeps<T extends {}, K extends keyof T = keyof T> = {
  basic: {
    deps?: K[];
    children?: ReactElement;
    validators?: Array<Validator | null>;
  };
  case1: {
    deps: K[];
    validators: (value: T) => Array<Validator | null>;
  };
  case2: {
    deps: K[];
    children: (value: T) => ReactElement;
  };
};

export type FormItemProps<
  T extends {},
  K extends keyof T = keyof T
> = BasicFormItemProps<T, K> & (ValueOf<FormItemPropsDeps<T, K>>);

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

export function createForm<T extends {}>({
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
      deps = [],
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
      {
        dependencies: [props.name, ...deps],
        shouldUpdate: createShouldUpdate([props.name, ...deps])
      },
      (_: any, { touched, validating }: FieldData, form: FormInstance<T>) => {
        const { getFieldError, getFieldsValue } = form;
        const errors = getFieldError(props.name);

        const field = React.createElement(
          RcField,
          {
            rules: [...rules, ..._rules],
            validateTrigger,
            ...props
          },
          typeof children !== 'function'
            ? children
            : children(getFieldsValue(deps))
        );

        if (noStyle) {
          return field;
        }

        return React.createElement(
          'div',
          {
            className: [
              ClassName.item,
              errors && !!errors.length && ClassName.error,
              touched && ClassName.touched,
              validating && ClassName.validating
            ]
              .filter(Boolean)
              .join(' ')
              .trim()
          },
          React.createElement('label', { className: ClassName.label }, label),
          field,
          React.createElement('div', { className: ClassName.help }, errors[0])
        );
      }
    );
  });

  const Form = React.memo(
    React.forwardRef<FormInstance<T>, FormProps<T>>(
      ({ children, onFinish, ...props }, ref: any) =>
        React.createElement(
          RcForm,
          {
            ...props,
            ref,
            onFinish
          } as any,
          children
        )
    )
  );

  const useForm: (
    form?: FormInstance<T>
  ) => [FormInstance<T>] = RcUseForm as any;

  return {
    Form,
    FormItem,
    useForm
  };
}
