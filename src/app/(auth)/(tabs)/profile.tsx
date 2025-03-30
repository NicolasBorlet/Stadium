import { Button, Screen, Text } from "@/components"
import { useAuth } from "@/contexts/AuthContext"
import { spacing, ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, View, ViewStyle } from "react-native"

export default observer(function ProfileScreen() {
  const { themed } = useAppTheme()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <Screen safeAreaEdges={["top"]} contentContainerStyle={themed($container)}>
      <View style={themed($content)}>
        <View style={themed($profileHeader)}>
          <View style={themed($avatarContainer)}>
            <Image
              source={require("../../../../assets/images/welcome-face.png")}
              style={themed($avatar)}
            />
          </View>
          <Text text={user?.name || "Utilisateur"} preset="heading" />
          <Text text={`Membre depuis ${user?.memberSince || "2024"}`} preset="default" />
        </View>

        <View style={themed($profileInfo)}>
          <View style={themed($infoItem)}>
            <Text text="Email" preset="default" />
            <Text text={user?.email || "user@example.com"} preset="default" />
          </View>
          <View style={themed($infoItem)}>
            <Text text="Pays" preset="default" />
            <Text text={user?.country || "France"} preset="default" />
          </View>
        </View>

        <View style={themed($actions)}>
          <Button text="Se déconnecter" onPress={handleSignOut} />
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

const $profileHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.xl,
})

const $avatarContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: colors.palette.neutral200,
  marginBottom: spacing.md,
  overflow: "hidden",
})

const $avatar: ThemedStyle<ImageStyle> = () => ({
  width: "100%",
  height: "100%",
})

const $profileInfo: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
})

const $infoItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: spacing.sm,
})

const $actions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: "auto",
  paddingTop: spacing.xl,
})
