import ChannelPost from "@/components/post/ChannelPost";
import { mockDataChannels } from "@/mockData";
import { MessageCircle, Clock4 } from "lucide-react";
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
  const channel = mockDataChannels.find((channel) => channel.id === params.id);

  if (!channel) {
    return <div>Channel not found</div>;
  }

  return (
    <div className="flex flex-col gap-4 mt-8">
      <div className="flex flex-row items-center gap-2">
        <h2 className="text-2xl font-bold">Posts</h2>
        {/* <p className="text-sm text-gray-500 font-light">2 new posts</p> */}
      </div>

      <div className="gap-4 flex flex-col">
        {channel.posts?.map((post) => (
          <ChannelPost key={post.id} post={post} channelId={channel.id} />
        ))}
      </div>
    </div>
  );
}
