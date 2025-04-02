import { Screen, Text } from "@/components"
import { useUserStadiums } from "@/hooks/useFirestore"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View, ViewStyle } from "react-native"

const StadiumItem = ({ item }: { item: any }) => {
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
    >
      <View
        style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            <MaterialCommunityIcons name="stadium" size={20} color="#007AFF" />
            <Text style={{ fontSize: 17, fontWeight: "600", marginLeft: 8, color: "#000" }}>
              {item.name}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="map-marker" size={18} color="#8E8E93" />
            <Text style={{ fontSize: 15, marginLeft: 8, color: "#8E8E93" }}>{item.city}</Text>
          </View>

          {item.image && (
            <Image
              source={{ uri: "https://picsum.photos/200/300" }}
              style={{ width: "100%", height: 150, borderRadius: 8, marginTop: 8 }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function StadiaScreen() {
  const { data: stadiums, isLoading, error } = useUserStadiums()
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
        <Text>Une erreur est survenue</Text>
      </View>
    )
  }

  if (!stadiums?.length) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Aucun stade trouvé</Text>
      </View>
    )
  }

  return (
    <Screen safeAreaEdges={["top"]} contentContainerStyle={themed($container)}>
      <View style={themed($content)}>
        <View
          style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        >
          <Text text="Stadium" preset="heading" />
        </View>
        <FlatList
          data={stadiums}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <StadiumItem item={item} />}
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
