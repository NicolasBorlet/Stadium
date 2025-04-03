import { Button, Screen, Text, TextField } from "@/components"
import { useAuth } from "@/contexts/AuthContext"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { router } from "expo-router"
import { observer } from "mobx-react-lite"
import { useState } from "react"
import { View, ViewStyle } from "react-native"

export default observer(function SignUpScreen() {
  const { themed } = useAppTheme()
  const { signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [country, setCountry] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async () => {
    setIsLoading(true)
    try {
      await signUp(email, password, name, country)
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
        <Text text="Créer un compte" preset="heading" />
        <View style={themed($form)}>
          <TextField label="Nom" value={name} onChangeText={setName} autoCapitalize="words" />
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
          <TextField
            label="Pays"
            value={country}
            onChangeText={setCountry}
            autoCapitalize="words"
          />
          <Button text="S'inscrire" onPress={handleSignUp} disabled={isLoading} />
          <Button
            text="Déjà un compte ? Se connecter"
            onPress={() => router.push("/sign-in")}
            preset="default"
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
