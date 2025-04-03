import { Screen, Text } from "@/components"
import { useTopRankings, useUserMatches, useUserRanking, useUserStats } from "@/hooks/useFirestore"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { observer } from "mobx-react-lite"
import { useMemo } from "react"
import { TextStyle, View, ViewStyle } from "react-native"

export default observer(function StatsScreen() {
  const { data: stats, isLoading, error } = useUserStats()
  const { themed } = useAppTheme()
  const { data: matches } = useUserMatches()
  const { data: topRankings } = useTopRankings()
  const { data: userRanking } = useUserRanking()

  const calculatedStats = useMemo(() => {
    if (!matches || matches.length === 0) return null

    // Calculer le stade le plus visité
    const stadiumCounts = matches.reduce(
      (acc, match) => {
        const stadiumName = match.stadium.name
        acc[stadiumName] = (acc[stadiumName] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const mostVisitedStadium = Object.entries(stadiumCounts).reduce((a, b) => (a[1] > b[1] ? a : b))

    // Calculer l'équipe la plus vue
    const teamCounts = matches.reduce(
      (acc, match) => {
        const homeTeamName = match.homeTeam.name
        const awayTeamName = match.awayTeam.name
        acc[homeTeamName] = (acc[homeTeamName] || 0) + 1
        acc[awayTeamName] = (acc[awayTeamName] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const mostWatchedTeam = Object.entries(teamCounts).reduce((a, b) => (a[1] > b[1] ? a : b))

    return {
      mostVisitedStadium: {
        name: mostVisitedStadium[0],
        count: mostVisitedStadium[1],
      },
      mostWatchedTeam: {
        name: mostWatchedTeam[0],
        count: mostWatchedTeam[1],
      },
    }
  }, [matches])

  if (isLoading) {
    return (
      <View style={themed($loadingContainer)}>
        <Text>Chargement...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={themed($loadingContainer)}>
        <Text>Une erreur est survenue</Text>
      </View>
    )
  }

  if (!matches || matches.length === 0) {
    return (
      <Screen safeAreaEdges={["top"]} contentContainerStyle={themed($container)} preset="scroll">
        <View style={themed($content)}>
          <Text text="Statistiques" preset="heading" />
          <View style={themed($emptyStateContainer)}>
            <Text text="Vous n'avez pas encore de matchs enregistrés" preset="default" />
            <Text
              text="Commencez à ajouter des matchs pour voir vos statistiques"
              preset="default"
            />
          </View>
        </View>
      </Screen>
    )
  }

  const showUserRanking =
    userRanking && (!topRankings || !topRankings.some((r) => r.id === userRanking.id))

  return (
    <Screen safeAreaEdges={["top"]} contentContainerStyle={themed($container)} preset="scroll">
      <View style={themed($content)}>
        <Text text="Statistiques" preset="heading" />
        <View style={themed($statsContainer)}>
          <View style={themed($statItem)}>
            <Text text={(stats?.totalMatches ?? 0).toString()} preset="heading" />
            <Text text="Matchs vus" preset="default" />
          </View>
          <View style={themed($statItem)}>
            <Text text={(stats?.totalStadiums ?? 0).toString()} preset="heading" />
            <Text text="Stades visités" preset="default" />
          </View>
          <View style={themed($statItem)}>
            <Text text="0" preset="heading" />
            <Text text="Pays visités" preset="default" />
          </View>
        </View>
        <View style={themed($section)}>
          <View style={themed($calculatedStatsContainer)}>
            <View style={themed($calculatedStatItem)}>
              <Text text="Stade le plus visité" preset="default" />
              <Text text={calculatedStats?.mostVisitedStadium.name || "Aucun"} preset="default" />
              <Text
                text={`${calculatedStats?.mostVisitedStadium.count || 0} visites`}
                preset="default"
              />
            </View>
            <View style={themed($calculatedStatItem)}>
              <Text text="Équipe la plus vue" preset="default" />
              <Text text={calculatedStats?.mostWatchedTeam.name || "Aucune"} preset="default" />
              <Text
                text={`${calculatedStats?.mostWatchedTeam.count || 0} matchs`}
                preset="default"
              />
            </View>
          </View>
        </View>
        <View style={themed($section)}>
          <Text text="Classement" preset="heading" style={themed($sectionTitleText)} />
          <View style={themed($rankingContainer)}>
            {topRankings?.map((ranking, index) => (
              <View key={ranking.id} style={themed($rankingItem)}>
                <Text text={`#${index + 1}`} preset="default" />
                <Text text={ranking.name || "Anonyme"} preset="default" />
                <Text text={ranking.points.toString()} preset="default" />
              </View>
            ))}
            {showUserRanking && (
              <View style={themed([$rankingItem, $userRankingItem])}>
                <Text text={`#${userRanking.rank || "?"}`} preset="default" />
                <Text text={userRanking.name || "Vous"} preset="default" />
                <Text text={userRanking.points.toString()} preset="default" />
              </View>
            )}
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

const $section: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xl,
})

const $sectionTitleText: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $calculatedStatsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.md,
})

const $calculatedStatItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  borderRadius: 8,
  backgroundColor: "rgba(0,0,0,0.05)",
})

const $loadingContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $emptyStateContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  gap: spacing.md,
  marginTop: spacing.xl,
})

const $rankingContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $rankingItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: spacing.md,
  borderRadius: 8,
  backgroundColor: "rgba(0,0,0,0.05)",
})

const $userRankingItem: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary100,
  borderWidth: 1,
  borderColor: colors.palette.primary500,
})
