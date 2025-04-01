import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"

export function PlusButton() {
  const router = useRouter()
  const isOpen = useSharedValue(0)
  const rotation = useSharedValue(0)

  const toggleMenu = () => {
    isOpen.value = withSpring(isOpen.value === 0 ? 1 : 0)
    rotation.value = withTiming(rotation.value === 0 ? 45 : 0)
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
          translateY: interpolate(isOpen.value, [0, 1], [0, -80], Extrapolate.CLAMP),
        },
        {
          translateX: interpolate(isOpen.value, [0, 1], [0, -60], Extrapolate.CLAMP),
        },
      ],
      opacity: isOpen.value,
    }
  })

  const option2Style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(isOpen.value, [0, 1], [0, -80], Extrapolate.CLAMP),
        },
        {
          translateX: interpolate(isOpen.value, [0, 1], [0, 60], Extrapolate.CLAMP),
        },
      ],
      opacity: isOpen.value,
    }
  })

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.option, option1Style]}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => {
            toggleMenu()
            router.push("/add-match")
          }}
        >
          <MaterialCommunityIcons name="soccer" size={24} color="#007AFF" />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.option, option2Style]}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => {
            toggleMenu()
            router.push("/add-stadium")
          }}
        >
          <MaterialCommunityIcons name="stadium" size={24} color="#007AFF" />
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity style={styles.plusButton} onPress={toggleMenu}>
        <Animated.View style={plusButtonStyle}>
          <MaterialCommunityIcons name="plus" size={32} color="#007AFF" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  option: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionButton: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
})
