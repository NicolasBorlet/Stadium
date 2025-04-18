import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Tabs } from "expo-router"
import { CustomTabBar } from "../../components/CustomTabBar"

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        headerShown: false,
      }}
      tabBar={({ state, descriptors, navigation }) => (
        <CustomTabBar state={state} descriptors={descriptors} navigation={navigation} />
      )}
    >
      <Tabs.Screen
        name="(matches)"
        options={{
          title: "Matchs",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="soccer" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(stadiums)"
        options={{
          title: "Stades",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="stadium" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="plus"
        options={{
          title: "",
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
