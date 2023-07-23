"use client";

import ChannelPost from "@/components/post/ChannelPost";
import { useChannel } from "@/hooks/useChannel";

export default function Page({ params }: { params: { id: string } }) {
  // const channel = mockDataChannels.find((channel) => channel.id === params.id);
  const { data } = useChannel(Number(params.id));

  if (!data) {
    return <div>Channel not found</div>;
  }

  return (
    <div className="flex flex-col gap-4 mt-8">
      <div className="flex flex-row items-center gap-2">
        <h2 className="text-2xl font-bold">Posts</h2>
        {/* <p className="text-sm text-gray-500 font-light">2 new posts</p> */}
      </div>

      <div className="gap-4 flex flex-col">
        {data?.posts.map((post, idx) => (
          <ChannelPost key={idx} post={post} channelId={post.channel_id} />
        ))}
      </div>
    </div>
  );
}
