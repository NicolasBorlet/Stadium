import auth from "@react-native-firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  country: string
  memberSince: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string, country: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("Setting up Firebase Auth listener")
    // Écouter les changements d'état d'authentification
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      console.log("Firebase Auth state changed:", firebaseUser?.uid)
      if (firebaseUser) {
        // Convertir l'utilisateur Firebase en format User
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "Utilisateur",
          country: "France", // À récupérer depuis Firestore plus tard
          memberSince: firebaseUser.metadata.creationTime || new Date().toISOString(),
        }
        setUser(userData)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => {
      console.log("Cleaning up Firebase Auth listener")
      unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log("Attempting to sign in with:", email)
      await auth().signInWithEmailAndPassword(email, password)
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
      const userCredential = await auth().createUserWithEmailAndPassword(email, password)
      await userCredential.user.updateProfile({
        displayName: name,
      })
      // TODO: Sauvegarder les informations supplémentaires (country) dans Firestore
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      console.log("Attempting to sign out")
      await auth().signOut()
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
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
