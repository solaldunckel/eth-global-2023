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
        <p className="text-sm text-gray-500 font-light">2 new posts</p>
      </div>

      <div className="gap-4 flex flex-col">
        {channel.posts?.map((post) => (
          <Link
            key={post.id}
            href={`/channel/${params.id}/topic/${post.id}`}
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
        ))}
      </div>
    </div>
  );
}
