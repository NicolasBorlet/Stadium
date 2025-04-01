import Config from "@/config"
import { createApi } from "apisauce"

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
}

const api = createApi({
  baseURL: "https://v3.football.api-sports.io",
  timeout: 10000,
  headers: {
    "x-rapidapi-host": "v3.football.api-sports.io",
    "x-rapidapi-key": Config.API_FOOTBALL_KEY,
  },
})

export const footballService = {
  async searchTeams(query: string) {
    const response = await api.get<{ response: Team[] }>("/teams", {
      search: query,
    })
    return response.data?.response || []
  },

  async getTeamById(teamId: number) {
    const response = await api.get<{ response: Team[] }>("/teams", {
      id: teamId,
    })
    return response.data?.response[0] || null
  },

  async getTeamMatches(teamId: number, season: number = new Date().getFullYear()) {
    const response = await api.get<{ response: Match[] }>("/fixtures", {
      team: teamId,
      season,
    })
    return response.data?.response || []
  },

  async getStadiumById(stadiumId: number) {
    const response = await api.get<{ response: Stadium[] }>("/venues", {
      id: stadiumId,
    })
    return response.data?.response[0] || null
  },

  async getMatchById(matchId: number) {
    const response = await api.get<{ response: Match[] }>("/fixtures", {
      id: matchId,
    })
    return response.data?.response[0] || null
  },
}
