"use client";

import ChannelHeader from "@/components/post/ChannelHeader";
import CreatePost from "@/components/post/CreatePost";
import { useChannel } from "@/hooks/useChannel";
import { Loader2 } from "lucide-react";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { data, isLoading } = useChannel(Number(params.id));

  if (isLoading) {
    return (
      <div className="h-full w-full justify-center items-center flex">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="h-full w-full justify-center items-center flex">
        Channel not found
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-row items-center justify-between">
        <ChannelHeader channel={data} />

        <div className="w-64 flex justify-end">
          <CreatePost channelId={data.id} />
        </div>
      </div>

      {children}
    </div>
  );
}
