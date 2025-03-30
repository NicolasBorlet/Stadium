import { Button, Screen, Text, TextField } from "@/components"
import { useAuth } from "@/contexts/AuthContext"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { router } from "expo-router"
import { observer } from "mobx-react-lite"
import { useState } from "react"
import { View, ViewStyle } from "react-native"

export default observer(function SignInScreen() {
  const { themed } = useAppTheme()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn(email, password)
      router.replace("/(tabs)")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Screen safeAreaEdges={["top"]} contentContainerStyle={themed($container)}>
      <View style={themed($content)}>
        <Text text="Connexion" preset="heading" />
        <View style={themed($form)}>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextField
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button text="Se connecter" onPress={handleSignIn} loading={isLoading} />
          <Button
            text="Créer un compte"
            onPress={() => router.push("/sign-up")}
            preset="secondary"
          />
        </View>
      </View>
    </Screen>
  )
})

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  padding: spacing.lg,
})

const $form: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
  marginTop: spacing.xl,
})
