import { Header, Screen, Text } from "@/components"
import { AnimatedText } from "@/components/AnimatedText"
import { useUserMatch } from "@/hooks/useFirestore"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { ActivityIndicator, TextStyle, View, ViewStyle } from "react-native"

export default function Match() {
  const { themed } = useAppTheme()
  const { id } = useLocalSearchParams()

  const { data: match, isLoading, error } = useUserMatch(id as string)

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
        <Text>Une erreur est survenue</Text>
      </View>
    )
  }

  if (!match) {
    return (
      <View style={themed($errorContainer)}>
        <Text>Aucun match trouvé</Text>
      </View>
    )
  }

  const matchDate =
    typeof match.date === "object" && "seconds" in match.date
      ? new Date((match.date as { seconds: number }).seconds * 1000)
      : new Date(match.date)

  return (
    <Screen contentContainerStyle={themed($container)}>
      <Header title="Détails du match" leftIcon="back" onLeftPress={() => router.back()} />
      <View style={themed($content)}>
        {/* En-tête */}
        <View style={themed($header)}>
          <AnimatedText
            sharedTransitionTag={`match-title-${match.id}`}
            preset="heading"
            text={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
          />
        </View>

        {/* Informations principales */}
        <View style={themed($card)}>
          <View style={themed($infoRow)}>
            <MaterialCommunityIcons name="calendar" size={20} color="#007AFF" />
            <Text style={themed($infoText)}>
              {matchDate.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>

          <View style={themed($infoRow)}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#007AFF" />
            <Text style={themed($infoText)}>
              {matchDate.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Paris",
              })}
            </Text>
          </View>

          <View style={themed($infoRow)}>
            <MaterialCommunityIcons name="stadium" size={20} color="#007AFF" />
            <Text style={themed($infoText)}>{match.stadium.name}</Text>
          </View>

          <View style={themed($infoRow)}>
            <MaterialCommunityIcons name="whistle" size={20} color="#007AFF" />
            <Text style={themed($infoText)}>Arbitre: {match.referee}</Text>
          </View>
        </View>

        {/* Score */}
        <View style={themed($card)}>
          <View style={themed($scoreContainer)}>
            <View style={themed($teamContainer)}>
              <AnimatedText text={match.homeTeam.name} preset="subheading" />
              <AnimatedText text={match.score[1].home?.toString() ?? "0"} preset="heading" />
            </View>
            <Text text="-" preset="heading" />
            <View style={themed($teamContainer)}>
              <Text text={match.awayTeam.name} preset="subheading" />
              <Text text={match.score[1].away?.toString() ?? "0"} preset="heading" />
            </View>
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

const $scoreContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
})

const $teamContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  flex: 1,
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
