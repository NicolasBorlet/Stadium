import { getAuth } from "@react-native-firebase/auth"
import { getFirestore } from "@react-native-firebase/firestore"

declare global {
  var RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS: boolean
}

// Silence deprecation warnings
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true

export const auth = getAuth()
export const db = getFirestore()

export default auth
