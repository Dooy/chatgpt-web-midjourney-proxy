import type { GlobalThemeOverrides } from 'naive-ui'
import { computed, watch } from 'vue'
import { darkTheme, useOsTheme } from 'naive-ui'
import { useAppStore } from '@/store'

export function useTheme() {
  const appStore = useAppStore()

  const OsTheme = useOsTheme()

  const isDark = computed(() => {
    if (appStore.theme === 'auto')
      return OsTheme.value === 'dark'
    else
      return appStore.theme === 'dark'
  })

  const theme = computed(() => {
    return isDark.value ? darkTheme : undefined
  })

  const themeOverrides = computed<GlobalThemeOverrides>(() => {
    if (isDark.value) {
      return {
        common: {
          primaryColor: '#b076ff',
          primaryColorHover: '#b076ff',
          primaryColorPressed: '#b076ff'
        },
        Slider: {
          "fillColor": "rgba(176, 118, 255, 1)",
          "fillColorHover": "rgba(176, 118, 255, 1)"
        }
      }
    }
    return {
      common: {
        primaryColor: '#b076ff',
        primaryColorHover: '#b076ff',
        primaryColorPressed: '#b076ff'
      },
      Slider: {
        "fillColor": "rgba(176, 118, 255, 1)",
        "fillColorHover": "rgba(176, 118, 255, 1)"
      }
    }
  })

  watch(
    () => isDark.value,
    (dark) => {
      if (dark)
        document.documentElement.classList.add('dark')
      else
        document.documentElement.classList.remove('dark')
    },
    { immediate: true },
  )

  return { theme, themeOverrides }
}
