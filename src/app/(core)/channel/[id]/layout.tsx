import ChannelHeader from "@/components/post/ChannelHeader";
import CreatePost from "@/components/post/CreatePost";
import { mockDataChannels } from "@/mockData";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const channel = mockDataChannels.find((channel) => channel.id === params.id);

  if (!channel) {
    return <div>Channel not found</div>;
  }

  return (
    <div className="p-8">
      <div className="flex flex-row items-center justify-between">
        <ChannelHeader channel={channel} />

        <div className="w-64 flex justify-end">
          <CreatePost channelId={channel.id} />
        </div>
      </div>

      {children}
    </div>
  );
}
