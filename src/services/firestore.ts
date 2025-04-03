import { auth, db } from "@/config/firebase"
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "@react-native-firebase/firestore"

export interface UserData {
  id: string
  email: string
  name: string
  country: string
  memberSince: Date
  createdAt: Date
  updatedAt: Date
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

export interface TeamData {
  id: string
  name: string
  image: string
}

export interface BadgeData {
  id: string
  name: string
  description: string
  image: string
  createdAt: Date
}

export interface FriendData {
  id: string
  userId: string
  friendId: string
  name: string
  status: "pending" | "accepted" | "rejected"
  createdAt: Date
  updatedAt: Date
}

export interface UserStats {
  mostVisitedStadium: {
    id: string
    name: string
    count: number
  }
  mostWatchedTeam: {
    id: string
    name: string
    count: number
  }
}

export interface RankingData {
  id: string
  name: string
  points: number
  rank?: number
}

export const userService = {
  async createUser(data: Omit<UserData, "id" | "createdAt" | "updatedAt">) {
    const userId = auth.currentUser?.uid
    if (!userId) throw new Error("No authenticated user")

    const now = new Date()
    const userData: UserData = {
      id: userId,
      ...data,
      memberSince: now,
      createdAt: now,
      updatedAt: now,
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
    const now = new Date()
    await updateDoc(doc(db, "users", userId), {
      ...data,
      updatedAt: now,
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

  async getStadiums() {
    const stadiumsSnapshot = await getDocs(collection(db, "stadiums"))
    return stadiumsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as StadiumData[]
  },
}

export const matchService = {
  async createMatch(userId: string, data: Omit<MatchData, "id" | "createdAt" | "updatedAt">) {
    const matchRef = doc(collection(db, "users", userId, "matchs"))

    const matchData: MatchData = {
      id: matchRef.id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(matchRef, matchData)

    await updateDoc(doc(db, "users", userId), {
      points: increment(5),
    })

    const rankingRef = doc(db, "ranking", userId)
    const rankingSnap = await getDoc(rankingRef)

    if (rankingSnap.exists) {
      await updateDoc(rankingRef, {
        points: increment(5),
      })
    } else {
      await setDoc(rankingRef, {
        user_id: userId,
        points: 5,
      })
    }

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

export const publicStadiumService = {
  async searchStadiums(searchTerm: string, lastDoc?: any) {
    let q = query(collection(db, "stadiums"), orderBy("name"))

    if (searchTerm) {
      q = query(q, where("name", ">=", searchTerm), where("name", "<=", searchTerm + "\uf8ff"))
    }

    if (lastDoc) {
      q = query(q, startAfter(lastDoc))
    }

    q = query(q, limit(10))
    const snapshot = await getDocs(q)

    return {
      stadiums: snapshot.docs.map((doc) => doc.data() as StadiumData),
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
    }
  },
}

export const teamService = {
  async getTeams() {
    const teamsSnapshot = await getDocs(collection(db, "teams"))
    return teamsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TeamData[]
  },
}

export const badgeService = {
  async getUserBadges(userId: string) {
    const q = query(collection(db, "users", userId, "badges"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as BadgeData)
  },

  async addBadgeToUser(userId: string, badgeId: string) {
    const badgeRef = doc(db, "badges", badgeId)
    const badgeSnap = await getDoc(badgeRef)

    if (!badgeSnap.exists) {
      throw new Error("Badge not found")
    }

    const badgeData = badgeSnap.data() as BadgeData
    await setDoc(doc(db, "users", userId, "badges", badgeId), {
      ...badgeData,
      createdAt: new Date(),
    })
  },

  async removeBadgeFromUser(userId: string, badgeId: string) {
    await deleteDoc(doc(db, "users", userId, "badges", badgeId))
  },
}

export const friendService = {
  async getFriends(userId: string) {
    const q = query(collection(db, "users", userId, "friends"), where("status", "==", "accepted"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as FriendData)
  },

  async getFriendRequests(userId: string) {
    const q = query(collection(db, "users", userId, "friends"), where("status", "==", "pending"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as FriendData)
  },

  async sendFriendRequest(userId: string, friendId: string) {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (!userDoc.exists) {
      throw new Error("Utilisateur non trouvé")
    }
    const userData = userDoc.data() as UserData

    const friendRef = doc(db, "users", friendId, "friends", userId)
    const friendData: FriendData = {
      id: userId,
      userId: userId,
      friendId: friendId,
      name: userData.name,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await setDoc(friendRef, friendData)
    return friendData
  },

  async acceptFriendRequest(userId: string, requestId: string) {
    const requestRef = doc(db, "users", userId, "friends", requestId)
    const requestSnap = await getDoc(requestRef)

    if (!requestSnap.exists) {
      throw new Error("Demande d'ami non trouvée")
    }

    const requestData = requestSnap.data() as FriendData
    const senderId = requestData.userId

    const userDoc = await getDoc(doc(db, "users", userId))
    if (!userDoc.exists) {
      throw new Error("Utilisateur non trouvé")
    }
    const userData = userDoc.data() as UserData

    await updateDoc(requestRef, {
      status: "accepted",
      updatedAt: new Date(),
    })

    const friendRef = doc(db, "users", senderId, "friends", userId)
    const friendData: FriendData = {
      id: userId,
      userId: senderId,
      friendId: userId,
      name: userData.name,
      status: "accepted",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await setDoc(friendRef, friendData)
  },

  async rejectFriendRequest(userId: string, requestId: string) {
    const requestRef = doc(db, "users", userId, "friends", requestId)
    const requestSnap = await getDoc(requestRef)

    if (!requestSnap.exists) {
      throw new Error("Demande d'ami non trouvée")
    }

    const requestData = requestSnap.data() as FriendData
    const senderId = requestData.userId

    const userDoc = await getDoc(doc(db, "users", userId))
    if (!userDoc.exists) {
      throw new Error("Utilisateur non trouvé")
    }
    const userData = userDoc.data() as UserData

    await updateDoc(requestRef, {
      status: "rejected",
      updatedAt: new Date(),
    })

    const friendRef = doc(db, "users", senderId, "friends", userId)
    const friendData: FriendData = {
      id: userId,
      userId: senderId,
      friendId: userId,
      name: userData.name,
      status: "rejected",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await setDoc(friendRef, friendData)
  },

  async removeFriend(userId: string, friendId: string) {
    await deleteDoc(doc(db, "users", userId, "friends", friendId))

    const q = query(collection(db, "users", friendId, "friends"), where("friendId", "==", userId))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      const docToDelete = snapshot.docs[0]
      await deleteDoc(doc(db, "users", friendId, "friends", docToDelete.id))
    }
  },
}

export const rankingService = {
  async getTopRankings() {
    const q = query(collection(db, "ranking"), orderBy("points", "desc"), limit(5))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as RankingData[]
  },

  async getUserRanking(userId: string) {
    const docSnap = await getDoc(doc(db, "ranking", userId))
    if (!docSnap.exists) return null
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as RankingData
  },
}
