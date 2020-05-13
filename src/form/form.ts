/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ReactElement, ReactNode } from 'react';
import RcForm, { Field as RcField, useForm as RcUseForm } from 'rc-field-form';
import { FormProps as RcFormProps } from 'rc-field-form/es/Form';
import { FieldProps as RcFieldProps } from 'rc-field-form/es/Field';
import { FieldData, FieldError, Store } from 'rc-field-form/lib/interface';
import { Validator, compose as composeValidator } from './validators';
import { NamePath } from './typings';

export type FormInstance<S extends {} = Store, K extends keyof S = keyof S> = {
  getFieldValue: <T extends NamePath<S>>(name: T) => T extends K ? S[T] : any;
  getFieldsValue: (nameList?: NamePath<S>[]) => S;
  getFieldError: (name: NamePath<S>) => string[];
  getFieldsError: (nameList?: NamePath<S>[]) => FieldError[];
  isFieldsTouched(
    nameList?: NamePath<S>[],
    allFieldsTouched?: boolean
  ): boolean;
  isFieldsTouched(allFieldsTouched?: boolean): boolean;
  isFieldTouched: (name: NamePath<S>) => boolean;
  isFieldValidating: (name: NamePath<S>) => boolean;
  isFieldsValidating: (nameList: NamePath<S>[]) => boolean;
  resetFields: (fields?: NamePath<S>[]) => void;
  setFields: (fields: FieldData[]) => void;
  setFieldsValue: (value: Partial<S>) => void;
  validateFields: (nameList?: NamePath<K>[]) => Promise<S>;
  submit: () => void;
};

export interface FormProps<S extends {} = Store, V = S>
  extends Omit<RcFormProps, 'form' | 'onFinish' | 'onValuesChange'> {
  form?: FormInstance<S>;
  initialValues?: Partial<V>;
  onFinish?: (values: V) => void;
  onValuesChange?: (changes: Partial<S>, values: S) => void;
  transoformInitialValues?: (payload: Partial<V>) => Partial<S>;
  beforeSubmit?: (payload: S) => V;
}

type OmititedRcFieldProps = Omit<
  RcFieldProps,
  'name' | 'dependencies' | 'children' | 'rules'
>;

interface BasicFormItemProps<S extends {} = Store>
  extends OmititedRcFieldProps {
  name?: NamePath<S>;
  children?: ReactElement | ((value: S) => ReactElement);
  validators?:
    | Array<Validator | null>
    | ((value: S) => Array<Validator | null>);
  onReset?(): void;
  label?: ReactNode;
  noStyle?: boolean;
  className?: string;
}

type FormItemPropsDeps<S extends {} = Store, K extends keyof S = keyof S> =
  | {
      deps?: K[];
      children?: ReactElement;
      validators?: Array<Validator | null>;
    }
  | {
      deps: K[];
      validators: (value: S) => Array<Validator | null>;
    }
  | {
      deps: K[];
      children: (value: S) => ReactElement;
    };

export type FormItemProps<
  S extends {} = Store,
  K extends keyof S = keyof S
> = BasicFormItemProps<S> & FormItemPropsDeps<S, K>;

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

export function createForm<S extends {} = Store, V = S>({
  itemClassName,
  ...defaultProps
}: Partial<FormItemProps<S>> & { itemClassName?: FormItemClassName } = {}) {
  const FormItem = (props_: FormItemProps<S>) => {
    const {
      name,
      children,
      validators = [],
      deps = [],
      noStyle,
      label,
      className = '',
      ...props
    } = {
      ...defaultProps,
      ...props_
    } as FormItemProps<S> & {
      deps?: Array<string | number>;
      name: string | number;
    };

    const ClassName = { ...defaultFormItemClassName, ...itemClassName };

    const rules: Rule[] =
      typeof validators === 'function'
        ? [
            ({ getFieldsValue }) => ({
              validator: composeValidator(
                validators(getFieldsValue(deps) as any)
              )
            })
          ]
        : [{ validator: composeValidator(validators) }];

    return React.createElement(
      RcField,
      {
        name,
        rules,
        dependencies: deps,
        shouldUpdate: createShouldUpdate(deps),
        ...props
      },
      (
        control: any,
        { touched, validating, errors }: FieldData,
        form: FormInstance<S>
      ) => {
        const { getFieldsValue } = form;

        const childNode =
          typeof children === 'function'
            ? children(getFieldsValue(deps))
            : React.cloneElement(children as React.ReactElement, {
                ...control
              });

        if (noStyle) {
          return childNode;
        }

        const error = errors && errors[0];

        return React.createElement(
          'div',
          {
            className: [
              className,
              ClassName.item,
              error && ClassName.error,
              touched && ClassName.touched,
              validating && ClassName.validating
            ]
              .filter(Boolean)
              .join(' ')
              .trim()
          },
          React.createElement('label', { className: ClassName.label }, label),
          childNode,
          React.createElement('div', { className: ClassName.help }, error)
        );
      }
    );
  };

  const Form = React.forwardRef<FormInstance<S>, FormProps<S>>(
    (
      {
        children,
        onFinish,
        beforeSubmit,
        initialValues,
        transoformInitialValues,
        ...props
      },
      ref
    ) =>
      React.createElement(
        RcForm,
        {
          ...props,
          ref,
          initialValues:
            initialValues && transoformInitialValues
              ? transoformInitialValues(initialValues)
              : initialValues,
          onFinish:
            onFinish &&
            ((store: any) => {
              onFinish(beforeSubmit ? beforeSubmit(store) : store);
            })
        } as any,
        children
      )
  );

  const useForm: (
    form?: FormInstance<S>
  ) => [FormInstance<S>] = RcUseForm as any;

  return {
    Form,
    FormItem,
    FormList: RcForm.List,
    FormProvider: RcForm.FormProvider,
    useForm
  };
}
