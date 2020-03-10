export type Validator = (rule: any, value: any) => Promise<void>;

export const compose = (validators: Array<Validator | null>): Validator => {
  return async (rule, value) => {
    for (const validator of validators) {
      if (validator) {
        try {
          await validator(rule, value);
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
    return Promise.resolve();
  };
};

export const required = (msg: string): Validator => (_, value) => {
  const val = typeof value === 'string' ? value.trim() : value;
  const valid = !!(Array.isArray(val)
    ? val.length
    : typeof value === 'boolean' // for checkbox
    ? value
    : !(typeof val === 'undefined' || val === null || val === ''));
  return valid ? Promise.resolve() : Promise.reject(msg);
};

export const number: Validator = (_, value) =>
  value === '' || /^-?\d*\.?\d*$/.test(value)
    ? Promise.resolve()
    : Promise.reject('Plase input number only');

export const integer = (msg: string): Validator => (_, value) =>
  value === '' || /^[0-9]+\d*$/.test(value)
    ? Promise.resolve()
    : Promise.reject(msg);

const numberComparation = (
  callback: (value: number, flag: number) => boolean
) => (flag: number, msg: string, inclusive = false) => {
  const validator: Validator = (_, value) => {
    const num = Number(value);
    return value === '' ||
      isNaN(num) ||
      callback(num, flag) ||
      (inclusive && num === flag)
      ? Promise.resolve()
      : Promise.reject(msg);
  };
  return validator;
};

// 最大/小值 e.g. min（最少值，错误信息，等于最少值是否通过）。
export const min = numberComparation((value, flag) => value > flag);
export const max = numberComparation((value, flag) => value < flag);

const lengthComparation = (
  callback: (length: number, flag: number) => boolean
) => (flag: number, msg: string) => {
  const validator: Validator = (_, value) => {
    if (Array.isArray(value) || typeof value === 'string') {
      return callback(value.length, flag)
        ? Promise.resolve()
        : Promise.reject(msg);
    }
    return Promise.resolve();
  };
  return validator;
};

export const minLength = lengthComparation(
  (length, minLength) => length >= minLength
);

export const maxLength = lengthComparation(
  (length, maxLength) => length <= maxLength
);

export const passwordFormat = (msg: string): Validator => (_, value) =>
  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,20}$/.test(value)
    ? Promise.resolve()
    : Promise.reject(msg);

export const shouldBeEqual = (val: any, msg: string): Validator => (_, value) =>
  value === val ? Promise.resolve() : Promise.reject(msg);

export const shouldNotBeEqual = (val: any, msg: string): Validator => (
  _,
  value
) => (value !== val ? Promise.resolve() : Promise.reject(msg));
