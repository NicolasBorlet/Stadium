import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { initI18n } from "@/i18n"
import { useInitialRootStore } from "@/models"
import { customFontsToLoad } from "@/theme"
import { loadDateFnsLocale } from "@/utils/formatDate"
import { useThemeProvider } from "@/utils/useAppTheme"
import { useFonts } from "@expo-google-fonts/space-grotesk"
import { Slot, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { KeyboardProvider } from "react-native-keyboard-controller"

export { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary"

function RootLayoutNav() {
  const { rehydrated } = useInitialRootStore()
  const [fontsLoaded, fontError] = useFonts(customFontsToLoad)
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)
  const { themeScheme, setThemeContextOverride, ThemeProvider } = useThemeProvider()
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    initI18n()
      .then(() => setIsI18nInitialized(true))
      .then(() => loadDateFnsLocale())
  }, [])

  useEffect(() => {
    if (fontError) throw fontError
  }, [fontError])

  useEffect(() => {
    console.log("Auth state:", { user, isLoading, fontsLoaded, isI18nInitialized })

    if (isLoading || !fontsLoaded || !isI18nInitialized) {
      console.log("Waiting for initialization...")
      return
    }

    // Si l'utilisateur n'est pas connecté, rediriger vers la connexion
    if (!user) {
      console.log("User not authenticated, redirecting to sign-in")
      router.replace("/sign-in")
    }
    // Si l'utilisateur est connecté, rediriger vers les onglets
    else {
      console.log("User authenticated, redirecting to tabs")
      router.replace("/(auth)/(tabs)/matches")
    }
  }, [user, isLoading, fontsLoaded, isI18nInitialized])

  if (!fontsLoaded || !isI18nInitialized) {
    console.log("Loading...")
    return null
  }

  return (
    <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
      <KeyboardProvider>
        <Slot />
      </KeyboardProvider>
    </ThemeProvider>
  )
}

export default function Root() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  )
}
