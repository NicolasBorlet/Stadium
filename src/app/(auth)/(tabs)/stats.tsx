import { Screen, Text } from "@/components"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"

export default observer(function StatsScreen() {
  const { themed } = useAppTheme()

  return (
    <Screen safeAreaEdges={["top"]} contentContainerStyle={themed($container)}>
      <View style={themed($content)}>
        <Text text="Statistiques" preset="heading" />
        <View style={themed($statsContainer)}>
          <View style={themed($statItem)}>
            <Text text="0" preset="heading" />
            <Text text="Matchs vus" preset="default" />
          </View>
          <View style={themed($statItem)}>
            <Text text="0" preset="heading" />
            <Text text="Stades visités" preset="default" />
          </View>
          <View style={themed($statItem)}>
            <Text text="0" preset="heading" />
            <Text text="Pays visités" preset="default" />
          </View>
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

const $statsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-around",
  marginTop: spacing.xl,
})

const $statItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  padding: spacing.md,
})
