"use client";
import { Channel, Post } from "@/types";
import { useQuery } from "@tanstack/react-query";

async function fetchPosts(channel_id: string) {
  const res = await fetch(`/api/channel/${channel_id}`);
  return res.json() as Promise<Channel>;
}

export const useChannel = (channelId: string) => {
  return useQuery({
    queryFn: () => fetchPosts(channelId),
    queryKey: ["channel", channelId],
    select: (data) => {
      return {
        ...data,
        posts: data.posts.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
      };
    },
  });
};
