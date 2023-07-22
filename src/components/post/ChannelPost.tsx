import { Clock4, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { FC } from "react";

type ChannelPostProps = {
  post: {
    id: string;
    title: string;
  };
  channelId: string;
};

const ChannelPost: FC<ChannelPostProps> = ({ post, channelId }) => {
  return (
    <Link
      key={post.id}
      href={`/channel/${channelId}/topic/${post.id}`}
      className="flex flex-col gap-2 bg-[#171717] p-4 rounded"
    >
      <h3 className="text-xl font-bold">{post.title}</h3>
      <div className="flex flex-row gap-4">
        <div className="flex flex-row items-center">
          <MessageCircle className="text-gray-500 w-4 h-4 mr-1.5" />
          <p className="text-xs text-gray-500 font-bold">23 comments</p>
        </div>

        <div className="flex flex-row items-center">
          <Clock4 className="text-gray-500 w-4 h-4 mr-1.5" />
          <p className="text-xs text-gray-500 font-bold">2 days ago</p>
        </div>
      </div>
    </Link>
  );
};

export default ChannelPost;
