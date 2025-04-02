import { Screen, Text } from "@/components"
import { useUserMatch } from "@/hooks/useFirestore"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { useLocalSearchParams } from "expo-router"
import { useEffect } from "react"
import { ActivityIndicator, View, ViewStyle } from "react-native"

export default function Match() {
  const { themed } = useAppTheme()
  const { id } = useLocalSearchParams()

  const { data: match, isLoading, error } = useUserMatch(id as string)

  useEffect(() => {
    if (match) {
      console.log(match)
    } else {
      console.log("no match", id)
    }
  }, [match, id])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Une erreur est survenue</Text>
      </View>
    )
  }

  if (!match) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Aucun match trouvé</Text>
      </View>
    )
  }

  return (
    <Screen safeAreaEdges={["top"]} contentContainerStyle={themed($container)}>
      <View style={themed($content)}>
        <View
          style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        >
          <Text text={`${match.homeTeam.name} vs ${match.awayTeam.name}`} preset="heading" />
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
