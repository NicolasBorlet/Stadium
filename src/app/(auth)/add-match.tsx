import { Screen } from "@/components"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Header } from "@/components/Header"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useCreateMatch, useStadiums, useTeams } from "@/hooks/useFirestore"
import { StadiumData, TeamData } from "@/services/firestore"
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { router } from "expo-router"
import { useState } from "react"
import { FlatList, ScrollView, View } from "react-native"

export default function AddMatch() {
  const [homeTeam, setHomeTeam] = useState<TeamData | null>(null)
  const [awayTeam, setAwayTeam] = useState<TeamData | null>(null)
  const [stadium, setStadium] = useState<StadiumData | null>(null)
  const [date, setDate] = useState<Date>(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [referee, setReferee] = useState("")
  const [showTeamSelector, setShowTeamSelector] = useState<"home" | "away" | null>(null)
  const [showStadiumSelector, setShowStadiumSelector] = useState(false)
  const [score, setScore] = useState([
    { home: "", away: "" },
    { home: "", away: "" },
  ])

  const { data: teams = [], isLoading: isLoadingTeams } = useTeams()
  const { data: stadiums = [], isLoading: isLoadingStadiums } = useStadiums()
  const createMatch = useCreateMatch()

  const handleCreateMatch = async () => {
    if (!homeTeam || !awayTeam || !date || !referee || !stadium) {
      console.log("[AddMatch] Validation error: Missing required fields", {
        homeTeam: !!homeTeam,
        awayTeam: !!awayTeam,
        date: !!date,
        referee: !!referee,
        stadium: !!stadium,
      })
      return
    }

    try {
      console.log("[AddMatch] Starting match creation with data:", {
        homeTeam: {
          id: parseInt(homeTeam.id),
          name: homeTeam.name,
          logo: homeTeam.image,
        },
        awayTeam: {
          id: parseInt(awayTeam.id),
          name: awayTeam.name,
          logo: awayTeam.image,
        },
        date: date,
        referee,
        status: "scheduled",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        score: score.map((period) => ({
          home: period.home ? parseInt(period.home) : null,
          away: period.away ? parseInt(period.away) : null,
        })),
        stadium,
      })

      await createMatch.mutateAsync({
        homeTeam: {
          id: parseInt(homeTeam.id),
          name: homeTeam.name,
          logo: homeTeam.image,
        },
        awayTeam: {
          id: parseInt(awayTeam.id),
          name: awayTeam.name,
          logo: awayTeam.image,
        },
        date: date,
        referee,
        status: "scheduled",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        score: score.map((period) => ({
          home: period.home ? parseInt(period.home) : null,
          away: period.away ? parseInt(period.away) : null,
        })),
        stadium,
      })

      console.log("[AddMatch] Match created successfully")
      router.back()
    } catch (error) {
      console.error("[AddMatch] Error creating match:", error)
      if (error instanceof Error) {
        console.error("[AddMatch] Error details:", {
          message: error.message,
          stack: error.stack,
        })
      }
    }
  }

  const handleScoreChange = (periodIndex: number, team: "home" | "away", value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      const newScore = [...score]
      newScore[periodIndex] = {
        ...newScore[periodIndex],
        [team]: value,
      }
      setScore(newScore)
    }
  }

  const renderTeamItem = ({ item: team }: { item: TeamData }) => (
    <Button
      key={team.id}
      text={team.name}
      onPress={() => {
        if (showTeamSelector === "home") {
          setHomeTeam(team)
        } else {
          setAwayTeam(team)
        }
        setShowTeamSelector(null)
      }}
    />
  )

  const renderStadiumItem = ({ item: stadium }: { item: StadiumData }) => (
    <Button
      key={stadium.id}
      text={stadium.name}
      onPress={() => {
        setStadium(stadium)
        setShowStadiumSelector(false)
      }}
    />
  )

  return (
    <Screen preset="scroll">
      <Header title="Ajouter un match" leftIcon="back" onLeftPress={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 162 }}>
        <View style={{ gap: 16 }}>
          <Card
            heading="Équipes"
            ContentComponent={
              <View style={{ gap: 12 }}>
                <Button
                  text={homeTeam ? homeTeam.name : "Sélectionner l'équipe à domicile"}
                  onPress={() => setShowTeamSelector("home")}
                />
                <Button
                  text={awayTeam ? awayTeam.name : "Sélectionner l'équipe à l'extérieur"}
                  onPress={() => setShowTeamSelector("away")}
                />
              </View>
            }
          />

          <Card
            heading="Score"
            ContentComponent={
              <View style={{ gap: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text text="1ère période" />
                  <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                    <View style={{ width: 60, height: 40, justifyContent: "center" }}>
                      <TextField
                        value={score[0].home}
                        onChangeText={(value) => handleScoreChange(0, "home", value)}
                        placeholder="0"
                        keyboardType="numeric"
                        style={{ textAlign: "center" }}
                      />
                    </View>
                    <Text text="-" />
                    <View style={{ width: 60, height: 40, justifyContent: "center" }}>
                      <TextField
                        value={score[0].away}
                        onChangeText={(value) => handleScoreChange(0, "away", value)}
                        placeholder="0"
                        keyboardType="numeric"
                        style={{ textAlign: "center" }}
                      />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text text="2ème période" />
                  <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                    <View style={{ width: 60, height: 40, justifyContent: "center" }}>
                      <TextField
                        value={score[1].home}
                        onChangeText={(value) => handleScoreChange(1, "home", value)}
                        placeholder="0"
                        keyboardType="numeric"
                        style={{ textAlign: "center" }}
                      />
                    </View>
                    <Text text="-" />
                    <View style={{ width: 60, height: 40, justifyContent: "center" }}>
                      <TextField
                        value={score[1].away}
                        onChangeText={(value) => handleScoreChange(1, "away", value)}
                        placeholder="0"
                        keyboardType="numeric"
                        style={{ textAlign: "center" }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            }
          />

          <Card
            heading="Stade"
            ContentComponent={
              <View style={{ gap: 12 }}>
                <Button
                  text={stadium ? stadium.name : "Sélectionner le stade"}
                  onPress={() => setShowStadiumSelector(true)}
                />
              </View>
            }
          />

          <Card
            heading="Informations du match"
            ContentComponent={
              <View style={{ gap: 12 }}>
                <Button
                  text={format(date, "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                  onPress={() => setShowDatePicker(true)}
                />
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="datetime"
                    display="default"
                    onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                      setShowDatePicker(false)
                      if (selectedDate) {
                        setDate(selectedDate)
                      }
                    }}
                  />
                )}
                <TextField
                  label="Arbitre"
                  value={referee}
                  onChangeText={setReferee}
                  placeholder="Nom de l'arbitre"
                />
              </View>
            }
          />

          <Button
            text="Créer le match"
            onPress={handleCreateMatch}
            disabled={!homeTeam || !awayTeam || !date || !referee || !stadium}
          />
        </View>
      </ScrollView>

      {showTeamSelector && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <Card
            heading="Sélectionner une équipe"
            ContentComponent={
              <View style={{ maxHeight: "80%" }}>
                {isLoadingTeams ? (
                  <Text text="Chargement des équipes..." />
                ) : (
                  <FlatList
                    data={teams}
                    renderItem={renderTeamItem}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    ListFooterComponent={() => (
                      <Button text="Annuler" onPress={() => setShowTeamSelector(null)} />
                    )}
                  />
                )}
              </View>
            }
          />
        </View>
      )}

      {showStadiumSelector && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <Card
            heading="Sélectionner un stade"
            ContentComponent={
              <View style={{ maxHeight: "80%" }}>
                {isLoadingStadiums ? (
                  <Text text="Chargement des stades..." />
                ) : (
                  <FlatList
                    data={stadiums}
                    renderItem={renderStadiumItem}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    ListFooterComponent={() => (
                      <Button text="Annuler" onPress={() => setShowStadiumSelector(false)} />
                    )}
                  />
                )}
              </View>
            }
          />
        </View>
      )}
    </Screen>
  )
}
