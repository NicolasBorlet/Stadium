import { auth } from "@/config/firebase"
import { UserData, userService } from "@/services/firestore"
import {
  createUserWithEmailAndPassword,
  FirebaseAuthTypes,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "@react-native-firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  user: UserData | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string, country: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("Setting up Firebase Auth listener")
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseAuthTypes.User | null) => {
        console.log("Firebase Auth state changed:", firebaseUser?.uid)
        if (firebaseUser) {
          try {
            const userData = await userService.getUser(firebaseUser.uid)
            if (!userData) {
              console.log("User not found in Firestore, signing out")
              await signOut(auth)
              setUser(null)
            } else {
              setUser(userData)
            }
          } catch (error) {
            console.error("Error fetching user data:", error)
            setUser(null)
          }
        } else {
          setUser(null)
        }
        setIsLoading(false)
      },
    )

    return () => {
      console.log("Cleaning up Firebase Auth listener")
      unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log("Attempting to sign in with:", email)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      const userData = await userService.getUser(userCredential.user.uid)
      if (!userData) {
        throw new Error("User not found in database")
      }

      setUser(userData)
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string, country: string) => {
    setIsLoading(true)
    try {
      console.log("Attempting to sign up with:", email)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, {
        displayName: name,
      })

      const userData = await userService.createUser({
        email,
        name,
        country,
        memberSince: new Date(),
      })

      setUser(userData)
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      console.log("Attempting to sign out")
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
