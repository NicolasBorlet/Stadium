import { auth, db } from "@/config/firebase"
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "@react-native-firebase/firestore"

export interface UserData {
  id: string
  email: string
  name: string
  country: string
  memberSince: Date
}

export interface StadiumData {
  id: string
  name: string
  address: string
  city: string
  capacity: number
  surface: string
  image: string
  createdAt: Date
  updatedAt: Date
}

export interface MatchData {
  id: string
  referee: string
  timezone: string
  date: Date
  status: string
  homeTeam: {
    id: number
    name: string
    logo: string
  }
  awayTeam: {
    id: number
    name: string
    logo: string
  }
  stadium: StadiumData
  score: [
    {
      home: number | null
      away: number | null
    },
    {
      home: number | null
      away: number | null
    },
  ]
  createdAt: Date
  updatedAt: Date
}

export const userService = {
  async createUser(data: Omit<UserData, "id">) {
    const userId = auth.currentUser?.uid
    if (!userId) throw new Error("No authenticated user")

    const userData: UserData = {
      id: userId,
      ...data,
      memberSince: new Date(),
    }

    await setDoc(doc(db, "users", userId), userData)
    return userData
  },

  async getUser(userId: string) {
    const docSnap = await getDoc(doc(db, "users", userId))
    if (!docSnap.exists) return null
    return docSnap.data() as UserData
  },

  async updateUser(userId: string, data: Partial<UserData>) {
    await updateDoc(doc(db, "users", userId), {
      ...data,
      updatedAt: new Date(),
    })
  },
}

export const stadiumService = {
  async createStadium(userId: string, data: Omit<StadiumData, "id" | "createdAt" | "updatedAt">) {
    const stadiumRef = doc(collection(db, "users", userId, "stadiums"))

    const stadiumData: StadiumData = {
      id: stadiumRef.id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(stadiumRef, stadiumData)
    return stadiumData
  },

  async getUserStadiums(userId: string) {
    const q = query(collection(db, "users", userId, "stadiums"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as StadiumData)
  },

  async getStadium(userId: string, stadiumId: string) {
    const docSnap = await getDoc(doc(db, "users", userId, "stadiums", stadiumId))
    if (!docSnap.exists) return null
    return docSnap.data() as StadiumData
  },

  async updateStadium(userId: string, stadiumId: string, data: Partial<StadiumData>) {
    await updateDoc(doc(db, "users", userId, "stadiums", stadiumId), {
      ...data,
      updatedAt: new Date(),
    })
  },

  async deleteStadium(userId: string, stadiumId: string) {
    await deleteDoc(doc(db, "users", userId, "stadiums", stadiumId))
  },
}

export const matchService = {
  async createMatch(userId: string, data: Omit<MatchData, "id" | "createdAt" | "updatedAt">) {
    const matchRef = doc(collection(db, "users", userId, "matches"))

    const matchData: MatchData = {
      id: matchRef.id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(matchRef, matchData)
    return matchData
  },

  async getUserMatches(userId: string) {
    const q = query(collection(db, "users", userId, "matchs"), orderBy("date", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as MatchData)
  },

  async getMatch(userId: string, matchId: string) {
    const docSnap = await getDoc(doc(db, "users", userId, "matchs", matchId))
    if (!docSnap.exists) return null
    return docSnap.data() as MatchData
  },

  async updateMatch(userId: string, matchId: string, data: Partial<MatchData>) {
    await updateDoc(doc(db, "users", userId, "matchs", matchId), {
      ...data,
      updatedAt: new Date(),
    })
  },

  async deleteMatch(userId: string, matchId: string) {
    await deleteDoc(doc(db, "users", userId, "matchs", matchId))
  },
}
