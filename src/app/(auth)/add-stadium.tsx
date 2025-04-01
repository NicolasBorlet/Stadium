import { StyleSheet, Text, View } from "react-native"

export default function AddStadium() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un stade</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
})
