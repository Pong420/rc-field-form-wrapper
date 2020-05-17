type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: NonNullable<Base[Key]> extends Condition ? Key : never;
};

type AllowNames<Base, Condition> = NonNullable<
  FilterFlags<Base, Condition>[keyof Base]
>;

type ValueOf<T> = T[keyof T];

export type FilterNamePath<Base> = {
  [Key in keyof Base]: Base[Key] extends any[]
    ?
        | [Key, number]
        | (FilterNamePath<Base[Key]>[number] extends never | unknown
            ? never
            : [
                Key,
                FilterNamePath<Base[Key]>[number][0],
                FilterNamePath<Base[Key]>[number][1]
              ])
    : NonNullable<Base[Key]> extends object
    ?
        | [Key, AllowNames<NonNullable<Base[Key]>, string | number | boolean>]
        | (AllowNamePath<Base[Key]>[number] extends never | unknown
            ? never
            :
                | [Key, AllowNamePath<Base[Key]>[0]]
                | [
                    Key,
                    AllowNamePath<Base[Key]>[0],
                    AllowNamePath<Base[Key]>[1]
                  ])
    : never;
};

export type AllowNamePath<Base> = ValueOf<FilterNamePath<Base>>;
export type NamePath<Base> = keyof Base | NonNullable<AllowNamePath<Base>>;
