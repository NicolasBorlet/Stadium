import { initializeApp } from "@react-native-firebase/app"
import auth from "@react-native-firebase/auth"

// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyBdqEDKOFunMP-fc9rWU8ggR2233uidowU",
  authDomain: "stadium-e1abe.firebaseapp.com",
  projectId: "stadium-e1abe",
  storageBucket: "stadium-e1abe.firebasestorage.app",
  messagingSenderId: "702787652384",
  appId: "1:702787652384:ios:49b2d5e2953c4228ebe545",
})

export { auth }
export default app
