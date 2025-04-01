import { footballService } from "@/services/api"
import { useQuery } from "@tanstack/react-query"

export function useSearchTeams(query: string) {
  return useQuery({
    queryKey: ["teams", "search", query],
    queryFn: () => footballService.searchTeams(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useTeam(teamId: number) {
  return useQuery({
    queryKey: ["teams", teamId],
    queryFn: () => footballService.getTeamById(teamId),
    enabled: !!teamId,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export function useTeamMatches(teamId: number, season?: number) {
  return useQuery({
    queryKey: ["matches", "team", teamId, season],
    queryFn: () => footballService.getTeamMatches(teamId, season),
    enabled: !!teamId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useStadium(stadiumId: number) {
  return useQuery({
    queryKey: ["stadiums", stadiumId],
    queryFn: () => footballService.getStadiumById(stadiumId),
    enabled: !!stadiumId,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}

export function useMatch(matchId: number) {
  return useQuery({
    queryKey: ["matches", matchId],
    queryFn: () => footballService.getMatchById(matchId),
    enabled: !!matchId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
