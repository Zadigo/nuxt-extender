import { promiseTimeout } from '@vueuse/core'
import { addDoc, collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { useDocument, useFirestore } from 'vuefire'
import type { MaybeEmpty, Nullable } from '~/types'

type SessionData = { [key: string]: unknown }

type CreateOptions<D extends SessionData = SessionData> = {
  name: string
  data: D
}

const SESSION_ID_NAME = 'nuxtAppSessionName'

/**
 * Composable used to declare a new session in Firestore. This is typically used when wanting
 * to track a user session for an application. This composable should be ideally initalized
 * before using the `useSession` composable, as it sets up the session ID in session storage which is used 
 * by `useSession` to sync with the correct Firestore document.
 * @param options - The options to initialize the session with. This includes the name of the session and the default data.
 */
// successCallbacks?: F[]
export function useCreateSession<D extends SessionData = SessionData>(options: CreateOptions<D>) {
  if (import.meta.server) {
    return {
      create: async () => { }
    }
  }

  const fireStore = useFirestore()
  const sessionIdName = useSessionStorage<string>(SESSION_ID_NAME, options.name)
  const sessionId = useSessionStorage<Nullable<string>>(options.name, null)

  async function create() {
    if (!isDefined(sessionId)) {
      try {
        const collectionRef = collection(fireStore, options.name)
        const data = await addDoc(collectionRef, { ...options.data })
        await promiseTimeout(800) // Wait a bit to ensure Firestore is ready
        
        sessionId.value = data.id
      } catch (error) {
        throw new Error(`Error creating ${options.name} session:` + error)
      }
    }
  }

  return {
    /**
     * The name of the session, which is also used as the 
     * key in session storage to store the session ID.
     */
    sessionIdName,
    /**
     * Creates a new session in Firestore with the provided options. 
     * The session ID will be stored in session storage under the key provided in
     * `options.name`.
     */
    create
  }
}

/**
 * This composable manages the blindtest session. It handles creating,
 * retrieving, updating, and deleting the session data in Firestore. A session
 * can be considered as a game instance where players can join and participate
 * in a blindtest
 */
export const useSession = createGlobalState(<T extends SessionData = SessionData>(defaultData: T, sessionIdName: string = 'sessionId') => {
  const error = ref<Nullable<string>>(null)
  const isSyncing = ref(false)
  const isLoading = ref(false)
  const isInitialSync = ref(true)
  const currentData = ref<MaybeEmpty<T>>()

  if (import.meta.server) {
    return {
      error,
      isSyncing,
      isLoading,
      docRef: null,
      sessionId: null,
      currentData,
      hasExistingSession: ref(false),
      reset: async () => { },
      remove: async () => { },
      refresh: async () => { }
    }
  }

  const _sessionIdName = useSessionStorage<string>(SESSION_ID_NAME, sessionIdName)
  const sessionId = useSessionStorage<Nullable<string>>(_sessionIdName.value, null)
  const hasExistingSession = computed(() => isDefined(sessionId))

  const firestore = useFirestore()

  const docRef = computed(() => {
    if (!sessionId.value) return null
    return doc(firestore, 'blindtests', sessionId.value)
  })

  const _currentData = computed(() => {
    if (!docRef.value) return null
    return useDocument<T>(docRef.value)
  })

  watch(() => _currentData.value?.value, (newValue) => {
    if (isDefined(newValue)) {
      currentData.value = newValue
      isInitialSync.value = false
    }
  })

  watchDebounced(currentData, async (newValue) => {
    if (!isDefined(docRef) || !isDefined(docRef) || !isDefined(sessionId) || isInitialSync.value || !isDefined(newValue)) return

    try {
      isSyncing.value = true
      await setDoc(docRef.value, newValue, { merge: true })
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isSyncing.value = false
    }
  }, {
    debounce: 1000,
    deep: true,
    immediate: false
  })

  async function reset() {
    if (!isDefined(docRef)) {
      console.warn('Cannot reset: No active session')
      return
    }

    try {
      isLoading.value = true
      await updateDoc(docRef.value, { ...defaultData })
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  async function remove() {
    if (!isDefined(docRef)) {
      console.warn('Cannot remove: No active session')
      return
    }

    try {
      isLoading.value = true
      await deleteDoc(docRef.value)
      sessionId.value = null
      currentData.value = undefined
      error.value = null
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  async function verify(): Promise<boolean> {
    if (!docRef.value) return false

    try {
      const snapshot = await getDoc(docRef.value)
      if (!snapshot.exists()) {
        console.warn(`Session ${sessionId.value} does not exist in Firestore`)
        sessionId.value = null
        return false
      }
      return true
    } catch (e) {
      console.error('Error verifying session:', e)
      error.value = e instanceof Error ? e.message : 'Failed to verify session'
      return false
    }
  }

  async function refresh() {
    if (!isDefined(docRef)) return

    try {
      isLoading.value = true
      const snapshot = await getDoc(docRef.value)

      if (snapshot.exists()) {
        currentData.value = snapshot.data() as MaybeEmpty<T>
        error.value = null
      } else {
        console.warn('Session does not exist')
        sessionId.value = null
      }
    } catch (e) {
      console.error('Error refreshing session:', e)
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  // Verify session exists on mount (if there's a session ID)
  tryOnMounted(async () => {
    if (sessionId.value) {
      await verify()
    }
  })

  return {
    /**
     * Error message, if any
     */
    error,
    /**
     * Whether the session is syncing with firestore
     * @default false
     */
    isSyncing,
    /**
     * Whether the session is loading data
     * @default false
     */
    isLoading,
    /**
     * Reference to the current session document in Firestore
     * @nullable
     */
    docRef,
    /**
     * Current session ID
     */
    sessionId: readonly(sessionId),
    /**
     * Blindtest settings for the current session
     */
    currentData,
    /**
     * Whether there is an existing session
     */
    hasExistingSession,
    /**
     * Resets an existing session.
     */
    reset,
    /**
     * Remove an existing session
     */
    remove,
    /**
     * Refresh the session data from Firestore
     * 
     */
    refresh
  }
})
