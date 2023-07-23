"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Lock } from "lucide-react";
import Image from "next/image";

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
              className="bg-[#111111]/25 border min-h-[100px] flex flex-row items-center border-gray-500/25 shadow-md rounded-md p-4"
            >
              {channel.image_url ? (
                <Image
                  src={channel.image_url}
                  width={128}
                  height={128}
                  className="rounded-full border border-white/25 h-12 w-12 object-cover mr-4"
                  unoptimized
                  alt="logo"
                />
              ) : (
                <div className="bg-gray-500/50 border border-white/25 h-12 w-12 rounded-full mr-4 shrink-0" />
              )}
              <div className="flex flex-col grow shrink overflow-ellipsis mr-4">
                <h1 className="text-xl font-bold">{channel.name}</h1>
                <p className="text-gray-500 text-sm font-light">
                  {channel.description}
                </p>
              </div>
              <div className="flex items-center">
                {channel.accessStatus === "denied" ? (
                  <Lock />
                ) : channel.accessStatus === "joined" ? (
                  <div className="flex flex-row gap-2 items-center">
                    <Check className="text-green-500 h-6 w-6" />
                  </div>
                ) : (
                  <Button
                    disabled={joinChannel.isLoading}
                    onClick={() => joinChannel.mutate(channel.id)}
                  >
                    Join
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
