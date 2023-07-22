"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Lock } from "lucide-react";

type DiscoverChannel = {
  id: number;
  name: string;
  category: string;
  image_url?: string;
  query: string;
  description: string;
  accessStatus: "allowed" | "denied" | "joined";
};
async function discoverChannels() {
  return fetch("/api/discover").then(
    (res) => res.json() as Promise<DiscoverChannel[]>
  );
}

async function joinChannelFn(channelId: number) {
  return fetch(`/api/channel/${channelId}`, {
    method: "POST",
  }).then((res) => res.json());
}

export default function Home() {
  const { data } = useQuery(["discover"], discoverChannels);
  const queryClient = useQueryClient();

  const joinChannel = useMutation({
    mutationFn: joinChannelFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["channels"]);
      queryClient.invalidateQueries(["discover"]);
    },
  });

  return (
    <div className="p-8">
      <div className="grid grid-cols-2 gap-2 ">
        {data?.map((channel, idx) => {
          return (
            <div
              key={idx}
              className="bg-[#111111]/25 border border-gray-500/25 shadow-md rounded-md p-4"
            >
              <h1 className="text-2xl font-bold">{channel.name}</h1>
              <p className="text-gray-500 text-sm">{channel.description}</p>
              {channel.accessStatus === "denied" ? (
                <Lock />
              ) : channel.accessStatus === "joined" ? (
                <p>Joined</p>
              ) : (
                <Button
                  disabled={joinChannel.isLoading}
                  onClick={() => joinChannel.mutate(channel.id)}
                >
                  Join
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
