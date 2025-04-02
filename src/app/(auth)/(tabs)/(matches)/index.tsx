import { Screen, Text } from "@/components"
import { AnimatedText } from "@/components/AnimatedText"
import { useUserMatches } from "@/hooks/useFirestore"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { ActivityIndicator, FlatList, TouchableOpacity, View, ViewStyle } from "react-native"

const MatchItem = ({ item }: { item: any }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "white",
        marginVertical: 6,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.05)",
      }}
      onPress={() => {
        router.push(`/(auth)/(tabs)/(matches)/${item.id}`)
      }}
    >
      <View
        style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <MaterialCommunityIcons name="soccer" size={20} color="#007AFF" />
            <AnimatedText
              sharedTransitionTag={`match-title-${item.id}`}
              style={{ fontSize: 17, fontWeight: "600", marginLeft: 8, color: "#000" }}
            >
              {item.homeTeam.name} vs {item.awayTeam.name}
            </AnimatedText>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <MaterialCommunityIcons name="scoreboard" size={18} color="#8E8E93" />
            <Text
              style={{ fontSize: 15, marginLeft: 8, color: "#8E8E93" }}
              tx="match:details.score"
              txOptions={{ home: item.score[1].home ?? 0, away: item.score[1].away ?? 0 }}
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="stadium" size={18} color="#8E8E93" />
            <Text style={{ fontSize: 15, marginLeft: 8, color: "#8E8E93" }}>
              {item.stadium.name}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function MatchesScreen() {
  const { data: matches, isLoading, error } = useUserMatches()

  const { themed } = useAppTheme()

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
        <Text tx="match:list.error" />
      </View>
    )
  }

  if (!matches?.length) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text tx="match:list.noMatches" />
      </View>
    )
  }

  return (
    <Screen safeAreaEdges={["top"]} contentContainerStyle={themed($container)}>
      <View style={themed($content)}>
        <View
          style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        >
          <Text tx="match:list.title" preset="heading" />
        </View>
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MatchItem item={item} />}
          contentContainerStyle={{ paddingVertical: 16 }}
        />
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
