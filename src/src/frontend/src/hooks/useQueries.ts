import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { VideoGenerationJob, VideoParams, Video } from "../backend";

// User Profile Query
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<{ name: string } | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      // @ts-expect-error - UserProfile methods exist on actor
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

// Save User Profile Mutation
export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: { name: string }) => {
      if (!actor) throw new Error("Actor not available");
      // @ts-expect-error - UserProfile methods exist on actor
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// Get User Videos
export function useGetUserVideos() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Video[]>({
    queryKey: ["userVideos"],
    queryFn: async () => {
      if (!actor) return [];
      const principal = await actor.getCallerUserRole();
      // Get the user's principal from the actor
      // @ts-expect-error - ic property exists
      const userPrincipal = actor.ic?.identity?.getPrincipal();
      if (!userPrincipal) return [];
      return actor.getUserVideos(userPrincipal);
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 5000, // Poll every 5 seconds for status updates
  });
}

// Get User Jobs (for monitoring generation progress)
export function useGetUserJobs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<VideoGenerationJob[]>({
    queryKey: ["userJobs"],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-expect-error - ic property exists
      const userPrincipal = actor.ic?.identity?.getPrincipal();
      if (!userPrincipal) return [];
      return actor.getUserJobs(userPrincipal);
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 3000, // Poll every 3 seconds during generation
  });
}

// Generate Video Mutation
export function useGenerateVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: VideoParams) => {
      if (!actor) throw new Error("Actor not available");
      return actor.generateVideo(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userJobs"] });
      queryClient.invalidateQueries({ queryKey: ["userVideos"] });
    },
  });
}

// Regenerate Video Mutation
export function useRegenerateVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      videoId,
      params,
    }: {
      videoId: string;
      params: VideoParams;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.regenerateVideo(videoId, params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userJobs"] });
      queryClient.invalidateQueries({ queryKey: ["userVideos"] });
    },
  });
}

// Delete Video Mutation
export function useDeleteVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteVideo(videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userVideos"] });
    },
  });
}

// Get Single Video
export function useGetVideo(videoId: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Video | null>({
    queryKey: ["video", videoId],
    queryFn: async () => {
      if (!actor || !videoId) return null;
      return actor.getVideo(videoId);
    },
    enabled: !!actor && !actorFetching && !!videoId,
  });
}
