import { Screen, Text } from "@/components"
import { Header } from "@/components/Header"
import Config from "@/config"
import { useCreateStadium, useSearchStadiums } from "@/hooks/useFirestore"
import { StadiumData } from "@/services/firestore"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"

const StadiumItem = ({
  item,
  onSelect,
}: {
  item: StadiumData
  onSelect: (stadium: StadiumData) => void
}) => {
  const { themed, theme } = useAppTheme()

  return (
    <TouchableOpacity style={themed($stadiumItem)} onPress={() => onSelect(item)}>
      <View style={themed($stadiumItemContent)}>
        <View style={themed($stadiumItemHeader)}>
          <View style={themed($stadiumItemTitleContainer)}>
            <MaterialCommunityIcons name="stadium" size={20} color={theme.colors.tint} />
            <Text style={themed($stadiumItemTitle)}>{item.name}</Text>
          </View>

          <View style={themed($stadiumItemLocationContainer)}>
            <MaterialCommunityIcons name="map-marker" size={18} color={theme.colors.textDim} />
            <Text style={themed($stadiumItemLocation)}>{item.city}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function AddStadium() {
  const [searchTerm, setSearchTerm] = useState("")
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchStadiums(searchTerm)
  const { themed, theme } = useAppTheme()
  const createStadium = useCreateStadium()

  const handleSelectStadium = async (stadium: StadiumData) => {
    try {
      // Créer une copie du stade sans les champs id, createdAt et updatedAt
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...stadiumData } = stadium

      // Ajouter le stade à la collection de l'utilisateur
      await createStadium.mutateAsync(stadiumData)

      // Retourner à l'écran précédent
      router.back()
    } catch (error) {
      console.error("Erreur lors de l'ajout du stade:", error)
      // TODO: Afficher une notification d'erreur à l'utilisateur
    }
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  useEffect(() => {
    console.log("fetching")
    fetch("https://v3.football.api-sports.io/leagues", {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": Config.API_FOOTBALL_KEY,
      },
    })
      .then((response) => {
        console.log(response)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <Screen contentContainerStyle={themed($container)}>
      <Header title="Ajouter un stade" leftIcon="back" onLeftPress={() => router.back()} />
      <View style={themed($content)}>
        <View style={themed($searchContainer)}>
          <View style={themed($searchIconContainer)}>
            <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.textDim} />
          </View>
          <TextInput
            style={themed($searchInput)}
            placeholder="Rechercher un stade..."
            placeholderTextColor={theme.colors.textDim}
            value={searchTerm}
            onChangeText={setSearchTerm}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity style={themed($clearButton)} onPress={() => setSearchTerm("")}>
              <MaterialCommunityIcons name="close-circle" size={18} color={theme.colors.textDim} />
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <View style={themed($loadingContainer)}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            data={data?.pages.flat()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <StadiumItem item={item} onSelect={handleSelectStadium} />}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              isFetchingNextPage ? (
                <View style={themed($loadingContainer)}>
                  <ActivityIndicator size="small" />
                </View>
              ) : null
            }
            contentContainerStyle={themed($listContent)}
          />
        )}
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

const $stadiumItem: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  marginVertical: spacing.xs,
  borderRadius: spacing.md,
  padding: spacing.lg,
  borderWidth: 1,
  borderColor: colors.border,
})

const $stadiumItemContent: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
})

const $stadiumItemHeader: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $stadiumItemTitleContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  marginBottom: spacing.xs,
})

const $stadiumItemTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 17,
  fontWeight: "600",
  marginLeft: spacing.sm,
  color: colors.text,
})

const $stadiumItemLocationContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
})

const $stadiumItemLocation: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 15,
  marginLeft: spacing.sm,
  color: colors.textDim,
})

const $searchContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral100,
  borderRadius: spacing.md,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  marginBottom: spacing.lg,
  borderWidth: 1,
  borderColor: colors.border,
})

const $searchIconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginRight: spacing.sm,
})

const $searchInput: ThemedStyle<TextStyle> = ({ spacing }) => ({
  flex: 1,
  fontSize: 16,
  paddingVertical: spacing.xs,
})

const $clearButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xs,
})

const $loadingContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
  alignItems: "center",
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.lg,
})
