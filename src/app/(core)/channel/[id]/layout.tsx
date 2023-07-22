"use client";
import ChannelHeader from "@/components/post/ChannelHeader";
import CreatePost from "@/components/post/CreatePost";
import { useChannel } from "@/hooks/useChannel";
import { mockDataChannels } from "@/mockData";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const { data } = useChannel(params.id);

  if (!data) {
    return <div>Channel not found</div>;
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
