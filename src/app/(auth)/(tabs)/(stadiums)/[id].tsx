import { Header, Screen } from "@/components"
import { AnimatedText } from "@/components/AnimatedText"
import { useUserStadium } from "@/hooks/useFirestore"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { ActivityIndicator, Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"

export default function Stadium() {
  const { themed } = useAppTheme()
  const { id } = useLocalSearchParams()

  const { data: stadium, isLoading, error } = useUserStadium(id as string)

  if (isLoading) {
    return (
      <View style={themed($loadingContainer)}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={themed($errorContainer)}>
        <AnimatedText tx="stadium:list.error" />
      </View>
    )
  }

  if (!stadium) {
    return (
      <View style={themed($errorContainer)}>
        <AnimatedText tx="stadium:list.noStadiums" />
      </View>
    )
  }

  return (
    <Screen contentContainerStyle={themed($container)}>
      <Header titleTx="stadium:details.title" leftIcon="back" onLeftPress={() => router.back()} />
      <View style={themed($content)}>
        {/* En-tête */}
        <View style={themed($header)}>
          <AnimatedText
            sharedTransitionTag={`stadium-title-${stadium.id}`}
            preset="heading"
            text={stadium.name}
          />
        </View>

        {/* Image */}
        {stadium.image && (
          <View style={themed($imageContainer)}>
            <Image source={{ uri: stadium.image }} style={themed($image)} resizeMode="cover" />
          </View>
        )}

        {/* Informations principales */}
        <View style={themed($card)}>
          <View style={themed($infoRow)}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#007AFF" />
            <AnimatedText style={themed($infoText)}>{stadium.address}</AnimatedText>
          </View>

          <View style={themed($infoRow)}>
            <MaterialCommunityIcons name="city" size={20} color="#007AFF" />
            <AnimatedText style={themed($infoText)}>{stadium.city}</AnimatedText>
          </View>

          <View style={themed($infoRow)}>
            <MaterialCommunityIcons name="account-group" size={20} color="#007AFF" />
            <AnimatedText
              style={themed($infoText)}
              tx="stadium:details.capacity"
              txOptions={{ capacity: stadium.capacity }}
            />
          </View>

          <View style={themed($infoRow)}>
            <MaterialCommunityIcons name="grass" size={20} color="#007AFF" />
            <AnimatedText
              style={themed($infoText)}
              tx="stadium:details.surface"
              txOptions={{ surface: stadium.surface }}
            />
          </View>
        </View>
      </View>
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  padding: spacing.lg,
})

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderRadius: 16,
  padding: spacing.lg,
  marginBottom: spacing.lg,
  borderWidth: 1,
  borderColor: "rgba(0, 0, 0, 0.05)",
})

const $infoRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  marginBottom: spacing.md,
})

const $infoText: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 15,
  marginLeft: spacing.md,
})

const $imageContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
  borderRadius: 16,
  overflow: "hidden",
})

const $image: ThemedStyle<ImageStyle> = () => ({
  width: "100%",
  height: 200,
})

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $errorContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})
