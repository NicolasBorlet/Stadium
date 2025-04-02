import Config from "@/config"

export interface Team {
  id: number
  name: string
  code: string
  country: string
  founded: number
  national: boolean
  logo: string
}

export interface Stadium {
  id: number
  name: string
  address: string
  city: string
  capacity: number
  surface: string
  image: string
}

export interface Match {
  id: number
  referee: string
  timezone: string
  date: string
  timestamp: number
  status: string
  homeTeam: Team
  awayTeam: Team
  stadium: Stadium
  score: {
    fulltime: {
      home: number | null
      away: number | null
    }
    halftime: {
      home: number | null
      away: number | null
    }
  }
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string
  }
}

const API_URL = "https://v3.football.api-sports.io"
const headers = {
  "x-rapidapi-host": "v3.football.api-sports.io",
  "x-rapidapi-key": Config.API_FOOTBALL_KEY,
}

async function fetchApi<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
  const queryParams = new URLSearchParams(params)
  const url = `${API_URL}${endpoint}?${queryParams.toString()}`

  try {
    const response = await fetch(url, { headers })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    throw error
  }
}

export const footballService = {
  async searchTeams(query: string) {
    try {
      const data = await fetchApi<{ response: Team[] }>("/teams", { search: query })
      return data.response || []
    } catch (error) {
      console.error("Error searching teams:", error)
      return []
    }
  },

  async getTeamById(teamId: number) {
    try {
      const data = await fetchApi<{ response: Team[] }>("/teams", { id: teamId })
      return data.response[0] || null
    } catch (error) {
      console.error("Error getting team:", error)
      return null
    }
  },

  async getTeamMatches(teamId: number, season: number = new Date().getFullYear()) {
    try {
      const data = await fetchApi<{ response: Match[] }>("/fixtures", {
        team: teamId,
        season,
      })
      return data.response || []
    } catch (error) {
      console.error("Error getting team matches:", error)
      return []
    }
  },

  async getStadiumById(stadiumId: number) {
    try {
      const data = await fetchApi<{ response: Stadium[] }>("/venues", { id: stadiumId })
      return data.response[0] || null
    } catch (error) {
      console.error("Error getting stadium:", error)
      return null
    }
  },

  async getMatchById(matchId: number) {
    try {
      const data = await fetchApi<{ response: Match[] }>("/fixtures", { id: matchId })
      return data.response[0] || null
    } catch (error) {
      console.error("Error getting match:", error)
      return null
    }
  },

  async getMatchesByDate(date: string) {
    try {
      const data = await fetchApi<{ response: Match[] }>("/fixtures", {
        date,
        league: "61,62", // Ligue 1 (61) and Ligue 2 (62)
      })
      return data.response || []
    } catch (error) {
      console.error("Error getting matches by date:", error)
      return []
    }
  },
}
