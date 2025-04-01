import { StyleSheet, Text, View } from "react-native"

export default function AddMatch() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un match</Text>
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
