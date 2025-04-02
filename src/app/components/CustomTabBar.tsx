import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"

type TabBarProps = {
  state: any
  descriptors: any
  navigation: any
}

export function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const isOpen = useSharedValue(0)
  const rotation = useSharedValue(0)
  const isAnimating = useSharedValue(false)

  const toggleMenu = () => {
    if (isAnimating.value) return
    isAnimating.value = true

    const newValue = isOpen.value === 0 ? 1 : 0
    isOpen.value = withSpring(
      newValue,
      {
        damping: 10,
        mass: 1,
        stiffness: 100,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 2,
      },
      (finished) => {
        if (finished) {
          isAnimating.value = false
        }
      },
    )
    rotation.value = withTiming(
      newValue === 1 ? 45 : 0,
      {
        duration: 300,
      },
      (finished) => {
        if (finished) {
          isAnimating.value = false
        }
      },
    )
  }

  const plusButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    }
  })

  const option1Style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(interpolate(isOpen.value, [0, 1], [0, -100], Extrapolate.CLAMP), {
            damping: 10,
            mass: 1,
            stiffness: 100,
          }),
        },
        {
          translateX: withSpring(interpolate(isOpen.value, [0, 1], [0, -60], Extrapolate.CLAMP), {
            damping: 10,
            mass: 1,
            stiffness: 100,
          }),
        },
        {
          scale: withSpring(interpolate(isOpen.value, [0, 1], [0.8, 1], Extrapolate.CLAMP), {
            damping: 12,
            mass: 1,
            stiffness: 120,
          }),
        },
      ],
      opacity: isOpen.value,
    }
  })

  const option2Style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(interpolate(isOpen.value, [0, 1], [0, -100], Extrapolate.CLAMP), {
            damping: 10,
            mass: 1,
            stiffness: 100,
          }),
        },
        {
          translateX: withSpring(interpolate(isOpen.value, [0, 1], [0, 60], Extrapolate.CLAMP), {
            damping: 10,
            mass: 1,
            stiffness: 100,
          }),
        },
        {
          scale: withSpring(interpolate(isOpen.value, [0, 1], [0.8, 1], Extrapolate.CLAMP), {
            damping: 12,
            mass: 1,
            stiffness: 120,
          }),
        },
      ],
      opacity: isOpen.value,
    }
  })

  const handleOptionPress = (action: () => void) => {
    if (isAnimating.value) return
    toggleMenu()
    action()
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.option, option1Style]}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() =>
            handleOptionPress(() => {
              router.push("/add-match")
            })
          }
        >
          <MaterialCommunityIcons name="soccer" size={24} color="#007AFF" />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.option, option2Style]}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() =>
            handleOptionPress(() => {
              router.push("/add-stadium")
            })
          }
        >
          <MaterialCommunityIcons name="stadium" size={24} color="#007AFF" />
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.tabBar}>
        <View style={styles.tabsContainer}>
          {/* First half of the tabs */}
          {state.routes.slice(0, 2).map((route: any, index: number) => {
            const { options } = descriptors[route.key]
            const isFocused = state.index === index
            const icon = options.tabBarIcon?.({
              color: isFocused ? "#007AFF" : "#8E8E93",
              size: 24,
            })
            const label = options.title || route.name

            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tab}
                onPress={() => navigation.navigate(route.name)}
              >
                {icon}
                <Text style={[styles.label, { color: isFocused ? "#007AFF" : "#8E8E93" }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            )
          })}

          {/* Plus button in the middle */}
          <View style={styles.tab}>
            <View style={styles.plusButtonWrapper}>
              <TouchableOpacity style={styles.plusButton} onPress={toggleMenu}>
                <Animated.View style={plusButtonStyle}>
                  <MaterialCommunityIcons name="plus" size={32} color="white" />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Second half of the tabs */}
          {state.routes.slice(2).map((route: any, index: number) => {
            const { options } = descriptors[route.key]
            const isFocused = state.index === index + 2
            const icon = options.tabBarIcon?.({
              color: isFocused ? "#007AFF" : "#8E8E93",
              size: 24,
            })
            const label = options.title || route.name

            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tab}
                onPress={() => navigation.navigate(route.name)}
              >
                {icon}
                <Text style={[styles.label, { color: isFocused ? "#007AFF" : "#8E8E93" }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tabBar: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 80,
    paddingHorizontal: 20,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      height: -2,
      width: 0,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    width: "100%",
  },
  tabsContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: "100%",
    justifyContent: "space-between",
    paddingBottom: 10,
    width: "100%",
  },
  tab: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
    paddingBottom: 10,
  },
  label: {
    fontSize: 12,
    marginTop: 6,
  },
  plusButtonWrapper: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    position: "relative",
    width: "100%",
  },
  plusButton: {
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    marginTop: -40,
    shadowColor: "#007AFF",
    shadowOffset: {
      height: 4,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: 60,
  },
  option: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: {
      height: 4,
      width: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: 50,
  },
  optionButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
})
