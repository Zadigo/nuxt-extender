/**
 * Composable to manage dark mode state
 */
export const useDarkModeComposable = createGlobalState((isActive: boolean = true) => {
  const [darkMode, toggleDarkMode] = useToggle()

  if (import.meta.client && isActive) {
    const colorMode = useColorMode({
      initialValue: 'light',
      onChanged(mode, defaultHandler) {
        if (mode == 'dark') {
          document.documentElement.classList.add('p-dark')
          defaultHandler(mode)
        } else {
          document.documentElement.classList.remove('p-dark')
          defaultHandler(mode)
        }
      }
    })

    watch(darkMode, (newValue) => {
      colorMode.value = newValue ? 'dark' : 'light'
    })

    onMounted(() => {
      darkMode.value = colorMode.value === 'dark' || (colorMode.value === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    })
  }

  return {
    /**
     * Dark mode state and toggle function
     */
    darkMode,
    /**
     * Function to toggle dark mode on and off
     */
    toggleDarkMode
  }
})
