import { Stack } from "expo-router"

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="add-match" options={{ presentation: "modal" }} />
      <Stack.Screen name="add-stadium" options={{ presentation: "modal" }} />
    </Stack>
  )
}
