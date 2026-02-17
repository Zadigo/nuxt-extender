import { promiseTimeout } from '@vueuse/core'
import { addDoc, collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { useDocument, useFirestore } from 'vuefire'
import type { MaybeEmpty, Nullable, SessionData } from '~/types'

/**
 * Composable used to declare a new session in Firestore. This is typically used when wanting
 * to track a user session for an application. This composable should be ideally initalized
 * before using the `useSession` composable, as it sets up the session ID in session storage which is used 
 * by `useSession` to sync with the correct Firestore document.
 * @param options - The options to initialize the session with. This includes the name of the session and the default data.
 */
// successCallbacks?: F[]
export function useCreateSession() {
  if (import.meta.server) {
    return {
      create: async () => { }
    }
  }

  const appConfig = useAppConfig()

  const fireStore = useFirestore()
  const sessionId = useCookie<Nullable<string>>(appConfig.sessions.name, {
    sameSite: 'strict',
    secure: true,
    maxAge: 60 * 60 * 72 // 3 days
  })

  async function create() {
    if (!isDefined(sessionId)) {
      try {
        const collectionRef = collection(fireStore, appConfig.sessions.collectionName)
        
        const data = await addDoc(collectionRef, { ...appConfig.sessions.initial })
        await promiseTimeout(800) // Wait a bit to ensure Firestore is ready
        
        sessionId.value = data.id
      } catch (error) {
        throw new Error(`Error creating ${appConfig.sessions.name} session:` + error)
      }
    }
  }

  return {
    /**
     * Creates a new session in Firestore with the provided options. 
     * The session ID will be stored in session storage under the key provided in
     * `appConfig.sessions.name`.
     */
    create
  }
}

/**
 * THis composable manaages the session state and synchronization with Firestore. It relies on the session 
 * ID being set in session storage, which is typically done by the `useCreateSession` composable. It provides 
 * reactive references for the current session data, loading and syncing states, and any errors that may occur during 
 * synchronization. It also provides methods to reset, remove, and refresh the session data.
 * @param options - The options to initialize the session with. This includes the name of the session and the default data.
 */
export const useSession = createGlobalState(<T extends { [key: string]: unknown }>() => {
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

  const appConfig = useAppConfig()

  const sessionId = useCookie<Nullable<string>>(appConfig.sessions.name)
  const hasExistingSession = computed(() => isDefined(sessionId))

  const firestore = useFirestore()

  const docRef = computed(() => {
    if (!isDefined(sessionId)) return null
    return doc(firestore, appConfig.sessions.collectionName, sessionId.value)
  })

  const _currentData = computed(() => {
    if (!docRef.value) return null
    return useDocument<T>(docRef.value)
  })

  watch(() => _currentData.value?.value, (newValue) => {
    if (isDefined(newValue) && !isDefined(currentData)) {
      currentData.value = newValue
      isInitialSync.value = false
    }
  })

  watchDebounced(currentData, async (newValue) => {
    if (!isDefined(docRef) || !isDefined(sessionId) || isInitialSync.value || !isDefined(newValue)) return

    try {
      isSyncing.value = true
      await setDoc(docRef.value, newValue, { merge: true })
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      await promiseTimeout(1000)
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
      await updateDoc(docRef.value, { ...appConfig.sessions.initial })
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
    if (!isDefined(docRef)) return false

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
  // tryOnMounted(async () => {
  //   if (isDefined(sessionId)) {
  //     await verify()
  //   }
  // })

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
     * Current data for the session. This is synced with Firestore and updates in real-time. 
     * It is initialized with the data from Firestore if it exists, or with the default data 
     * provided in `appConfig.sessions.initial` if not.
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
     * This can be useful if you want to manually trigger a refresh of the session data, 
     * for example after a period of inactivity or if you suspect the local data is out 
     * of sync with Firestore.
     */
    refresh
  }
})
