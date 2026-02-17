export type * from './graphql'

export type Arrayable<T> = T[]

export type Undefineable<T> = T | undefined

export type Nullable<T> = T | null

export type Refable<T> = Ref<T>

export type MaybeEmpty<T> = Undefineable<T> | Nullable<T>

export type KeysAsType<K extends string, T> = {
  [key in K]: T
}

export type KeyToRefs<K extends string, T> = {
  [key in K]: Ref<T>
}
