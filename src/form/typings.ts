export type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};

export type AllowNames<Base, Condition> = FilterFlags<
  Base,
  Condition
>[keyof Base];

export type ValueOf<T> = T[keyof T];

export type FilterNamePath<Base> = {
  [Key in keyof Base]: Base[Key] extends any[]
    ?
        | [Key, number]
        | (FilterNamePath<Base[Key]>[number] extends never
            ? never
            : [
                Key,
                FilterNamePath<Base[Key]>[number][0],
                FilterNamePath<Base[Key]>[number][1]
              ])
    : Base[Key] extends object
    ?
        | [Key, AllowNames<Base[Key], string | number>]
        | (AllowNamePath<Base[Key]>[number] extends never
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
export type NamePath<Base> = keyof Base | AllowNamePath<Base>;
