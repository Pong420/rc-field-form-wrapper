import React, { ReactElement } from 'react';
import AntdForm, {
  FormProps as AntdFormProps,
  FormItemProps as AntdFormItemProps,
} from 'antd/es/form';
import { FieldData, FieldError, Store } from 'rc-field-form/lib/interface';
import { Validator, compose as composeValidator } from './validators';
import { NamePath, Paths, PathType, DeepPartial } from './typings';

export type FormInstance<S extends {} = Store> = {
  getFieldValue<K extends keyof S>(name: K): S[K];
  getFieldValue<T extends Paths<S>>(name: T): PathType<S, T>;
  getFieldsValue(nameList?: NamePath<S>[]): S;
  getFieldError(name: NamePath<S>): string[];
  getFieldsError(nameList?: NamePath<S>[]): FieldError[];
  isFieldsTouched(
    nameList?: NamePath<S>[],
    allFieldsTouched?: boolean
  ): boolean;
  isFieldsTouched(allFieldsTouched?: boolean): boolean;
  isFieldTouched(name: NamePath<S>): boolean;
  isFieldValidating(name: NamePath<S>): boolean;
  isFieldsValidating(nameList: NamePath<S>[]): boolean;
  resetFields(fields?: NamePath<S>[]): void;
  setFields(fields: FieldData[]): void;
  setFieldsValue(value: DeepPartial<S>): void;
  validateFields<K extends keyof S>(nameList?: NamePath<K>[]): Promise<S>;
  submit: () => void;
  scrollToField(name: NamePath<S>): void;
};

export interface FormProps<S extends {} = Store, V = S>
  extends Omit<AntdFormProps, 'form' | 'onFinish' | 'onValuesChange' | 'ref'> {
  form?: FormInstance<S>;
  initialValues?: DeepPartial<V>;
  onFinish?: (values: V) => void;
  onValuesChange?: (changes: DeepPartial<S>, values: S) => void;
  ref?: React.Ref<FormInstance<S>>;
  transoformInitialValues?: (payload: DeepPartial<V>) => DeepPartial<S>;
  beforeSubmit?: (payload: S) => V;
}

type OmititedAntdFormItemProps = Omit<
  AntdFormItemProps,
  'name' | 'dependencies' | 'children' | 'rules'
>;

interface BasicFormItemProps<S extends {} = Store>
  extends OmititedAntdFormItemProps {
  name?: NamePath<S>;
  children?: ReactElement | ((value: S) => ReactElement);
  validators?:
    | Array<Validator | null>
    | ((value: S) => Array<Validator | null>);
}

type Deps<S> = Array<NamePath<S>>;
type FormItemPropsDeps<S extends {} = Store> =
  | {
      deps?: Deps<S>;
      children?: ReactElement;
      validators?: Array<Validator | null>;
    }
  | {
      deps: Deps<S>;
      validators: (value: S) => Array<Validator | null>;
    }
  | {
      deps: Deps<S>;
      children: (value: S) => ReactElement;
    };

export type FormItemProps<S extends {} = Store> = BasicFormItemProps<S> &
  FormItemPropsDeps<S>;

type Rule = NonNullable<AntdFormItemProps['rules']>[number];

const getValues = (obj: any, paths: (string | number)[]) =>
  paths.reduce<any>((result, key) => result && result[key], obj);

export function createShouldUpdate(
  names: Array<string | number | (string | number)[]> = []
): AntdFormItemProps['shouldUpdate'] {
  return (prev, curr) => {
    for (const name of names) {
      const paths = Array.isArray(name) ? name : [name];
      if (getValues(prev, paths) !== getValues(curr, paths)) {
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
      ...props_,
    } as FormItemProps<S> & {
      deps?: Array<string | number | (string | number)[]>;
      name: string | number;
    };

    const rules: Rule[] =
      typeof validators === 'function'
        ? [
            ({ getFieldsValue }) => ({
              validator: composeValidator(
                validators(getFieldsValue(deps) as any)
              ),
            }),
          ]
        : [{ validator: composeValidator(validators) }];

    return React.createElement(
      AntdFormItem,
      {
        rules,
        shouldUpdate: createShouldUpdate(deps),
        ...props,
      },
      typeof children === 'function'
        ? ({ getFieldsValue }: FormInstance<S>) =>
            children(getFieldsValue(deps))
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
          ref,
          initialValues:
            initialValues && transoformInitialValues
              ? transoformInitialValues(initialValues)
              : initialValues,
          onFinish:
            onFinish &&
            ((store: any) => {
              onFinish(beforeSubmit ? beforeSubmit(store) : store);
            }),
        } as any,
        children
      )
  );

  const useForm: () => [FormInstance<S>] = AntdForm.useForm as any;

  return {
    Form,
    FormItem,
    FormList: AntdForm.List,
    FormProvider: AntdForm.Provider,
    useForm,
  };
}
