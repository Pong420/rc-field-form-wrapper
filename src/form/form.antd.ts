import React, { ReactElement } from 'react';
import AntdForm, {
  FormProps as AntdFormProps,
  FormItemProps as AntdFormItemProps
} from 'antd/es/form';
import { FieldData, FieldError, Store } from 'rc-field-form/lib/interface';
import { Validator, compose as composeValidator } from './validators';
import { NamePath } from './typings';

type Rule = NonNullable<AntdFormItemProps['rules']>[number];

export type FormInstance<S extends {} = Store, K extends keyof S = keyof S> = {
  getFieldValue: (name: NamePath<S>) => S[K];
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
  scrollToField: (name: string | number | NamePath<K>) => void;
};

export interface FormProps<S extends {} = Store, V = S>
  extends Omit<AntdFormProps, 'form' | 'onFinish' | 'onValuesChange' | 'ref'> {
  form?: FormInstance<S>;
  initialValues?: Partial<V>;
  onFinish?: (values: V) => void;
  onValuesChange?: (changes: Partial<S>, values: S) => void;
  ref?: React.Ref<FormInstance<S>>;
  transoformInitialValues?: (payload: Partial<V>) => Partial<S>;
  beforeSubmit?: (payload: S) => V;
}

type OmititedAntdFormItemProps = Omit<
  AntdFormItemProps,
  'name' | 'dependencies' | 'children' | 'rules'
>;

interface BasicFormItemProps<S extends {} = Store, K extends keyof S = keyof S>
  extends OmititedAntdFormItemProps {
  name?: NamePath<S>;
  children?: ReactElement | ((value: S) => ReactElement);
  validators?:
    | Array<Validator | null>
    | ((value: S) => Array<Validator | null>);
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
> = BasicFormItemProps<S, K> & FormItemPropsDeps<S, K>;

export function createShouldUpdate<FieldName extends string | number>(
  names: FieldName[]
): AntdFormItemProps['shouldUpdate'] {
  return (prev, curr) => {
    for (const name of names) {
      if (prev[name] !== curr[name]) {
        return true;
      }
    }
    return false;
  };
}

const AntdFormItem = AntdForm.Item as React.FunctionComponent<
  Omit<AntdFormItemProps, 'children'>
>;

export function createForm<S extends {} = Store, V = S>(
  defaultProps?: Partial<FormItemProps<S>>
) {
  const FormItem = (props_: FormItemProps<S>) => {
    const { children, validators = [], deps = [], ...props } = {
      ...defaultProps,
      ...props_
    } as FormItemProps<S> & {
      deps?: Array<string | number>;
      name: string | number;
    };

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
      AntdFormItem,
      {
        rules,
        shouldUpdate: createShouldUpdate(deps),
        ...props
      },
      typeof children === 'function'
        ? ({ getFieldsValue }: FormInstance<S>) =>
            children(getFieldsValue(deps) as any)
        : children
    );
  };

  const Form = React.forwardRef<FormInstance<S>, FormProps<S, V>>(
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
        AntdForm,
        {
          ...props,
          initialValues:
            initialValues && transoformInitialValues
              ? transoformInitialValues(initialValues)
              : initialValues,
          onFinish:
            onFinish &&
            ((store: any) => {
              onFinish(beforeSubmit ? beforeSubmit(store) : store);
            }),
          ref
        } as any,
        children
      )
  );

  const useForm: (
    form?: FormInstance<S>
  ) => [FormInstance<S>] = AntdForm.useForm as any;

  return {
    Form,
    FormItem,
    FormList: AntdForm.List,
    FormProvider: AntdForm.Provider,
    useForm
  };
}
