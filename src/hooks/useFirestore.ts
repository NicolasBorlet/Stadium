import { useAuth } from "@/contexts/AuthContext"
import {
  MatchData,
  matchService,
  publicStadiumService,
  StadiumData,
  stadiumService,
  teamService,
} from "@/services/firestore"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

interface Team {
  id: string
  name: string
  image: string
}

// Hooks pour les stades
export function useUserStadiums() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ["userStadiums", "user", user?.id],
    queryFn: () => stadiumService.getUserStadiums(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useUserStadium(stadiumId: string) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ["userStadiums", stadiumId],
    queryFn: () => stadiumService.getStadium(user!.id, stadiumId),
    enabled: !!user?.id && !!stadiumId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCreateStadium() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (data: Omit<StadiumData, "id" | "createdAt" | "updatedAt">) =>
      stadiumService.createStadium(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStadiums", "user", user?.id] })
    },
  })
}

export function useUpdateStadium() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StadiumData> }) =>
      stadiumService.updateStadium(user!.id, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["userStadiums", "user", user?.id] })
      queryClient.invalidateQueries({ queryKey: ["userStadiums", id] })
    },
  })
}

export function useDeleteStadium() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (stadiumId: string) => stadiumService.deleteStadium(user!.id, stadiumId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStadiums", "user", user?.id] })
    },
  })
}

// Hooks pour les matchs
export function useUserMatches() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ["userMatches", "user", user?.id],
    queryFn: () => matchService.getUserMatches(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useUserMatch(matchId: string) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ["userMatches", matchId],
    queryFn: () => matchService.getMatch(user!.id, matchId),
    enabled: !!user?.id && !!matchId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCreateMatch() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (data: Omit<MatchData, "id" | "createdAt" | "updatedAt">) =>
      matchService.createMatch(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userMatches", "user", user?.id] })
    },
  })
}

export function useUpdateMatch() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MatchData> }) =>
      matchService.updateMatch(user!.id, id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["userMatches", "user", user?.id] })
      queryClient.invalidateQueries({ queryKey: ["userMatches", id] })
    },
  })
}

export function useDeleteMatch() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (matchId: string) => matchService.deleteMatch(user!.id, matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userMatches", "user", user?.id] })
    },
  })
}

// Hook pour les statistiques
export function useUserStats() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ["userStats", "user", user?.id],
    queryFn: async () => {
      const [stadiums, matches] = await Promise.all([
        stadiumService.getUserStadiums(user!.id),
        matchService.getUserMatches(user!.id),
      ])
      return {
        totalStadiums: stadiums.length,
        totalMatches: matches.length,
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useSearchStadiums(searchTerm: string) {
  const [lastDoc, setLastDoc] = useState<any>(null)
  const [hasMore, setHasMore] = useState(true)

  const query = useInfiniteQuery({
    queryKey: ["searchStadiums", searchTerm],
    queryFn: async ({ pageParam }) => {
      const result = await publicStadiumService.searchStadiums(searchTerm, pageParam)
      setLastDoc(result.lastDoc)
      setHasMore(result.stadiums.length === 10)
      return result.stadiums
    },
    initialPageParam: null,
    getNextPageParam: () => lastDoc,
    enabled: !!searchTerm,
  })

  return {
    ...query,
    hasMore,
  }
}

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: () => teamService.getTeams(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useStadiums() {
  return useQuery({
    queryKey: ["stadiums"],
    queryFn: () => stadiumService.getStadiums(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
