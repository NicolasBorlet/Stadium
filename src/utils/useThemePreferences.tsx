import { ThemeContexts } from "@/theme"
import { createContext, ReactNode, useContext, useState } from "react"
import { MMKV } from "react-native-mmkv"

const storage = new MMKV({
  id: "theme-preferences",
})

type ThemePreferences = {
  theme: ThemeContexts
  primaryColor: string
}

const THEME_PREFERENCES_KEY = "theme_preferences"

const defaultPreferences: ThemePreferences = {
  theme: undefined, // system default
  primaryColor: "#C76542", // default primary color
}

type ThemePreferencesContextType = {
  preferences: ThemePreferences
  setPreferences: (preferences: ThemePreferences) => void
}

const ThemePreferencesContext = createContext<ThemePreferencesContextType>({
  preferences: defaultPreferences,
  setPreferences: () => {},
})

export const ThemePreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferencesState] = useState<ThemePreferences>(() => {
    const stored = storage.getString(THEME_PREFERENCES_KEY)
    return stored ? JSON.parse(stored) : defaultPreferences
  })

  const setPreferences = (newPreferences: ThemePreferences) => {
    setPreferencesState(newPreferences)
    storage.set(THEME_PREFERENCES_KEY, JSON.stringify(newPreferences))
  }

  return (
    <ThemePreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </ThemePreferencesContext.Provider>
  )
}

export const useThemePreferences = () => {
  const context = useContext(ThemePreferencesContext)
  if (!context) {
    throw new Error("useThemePreferences must be used within a ThemePreferencesProvider")
  }
  return context
}
