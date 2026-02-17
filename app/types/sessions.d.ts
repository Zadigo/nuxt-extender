type SessionData = { [key: string]: unknown }

export type CreateSessonOptions = {
  name: string
  collectionName: string
  initial?: SessionData
}
