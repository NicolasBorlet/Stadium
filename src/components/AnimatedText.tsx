import { Text, TextProps } from "@/components/Text"
import Animated from "react-native-reanimated"

interface AnimatedTextProps extends TextProps {
  sharedTransitionTag?: string
}

export function AnimatedText({ sharedTransitionTag, ...props }: AnimatedTextProps) {
  const AnimatedTextComponent = Animated.createAnimatedComponent(Text)

  return <AnimatedTextComponent {...props} sharedTransitionTag={sharedTransitionTag} />
}
