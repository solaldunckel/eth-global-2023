import { Input } from "@/components/ui/input";
import { mockDataChannels } from "@/mockData";

export default function Page({
  params,
}: {
  params: { id: string; topicId: string };
}) {
  const channel = mockDataChannels.find((channel) => channel.id === params.id);
  const post = channel?.posts?.find((post) => post.id === params.topicId);

  return (
    <div className="flex flex-col mt-8">
      <h1 className="text-4xl font-bold">{post?.title}</h1>
      <div className="flex flex-row items-center text-start mt-1">
        <div className="text-sm text-gray-500">
          posted <span className="font-bold">2 days ago</span> by{" "}
          <span className="font-bold">0xboris</span>
        </div>
      </div>
      <div className="mt-4">{post?.content}</div>

      <div className="flex flex-col mt-4">
        {post?.messages?.map((comment) => (
          <div key={comment.id} className="flex flex-row gap-2 p-4">
            <div className="h-10 w-10 rounded-full bg-green-500"></div>
            <div className="flex flex-col">
              <h1 className="font-bold text-lg">solal dunckel</h1>
              <p className="text-sm font-light">{comment.content}</p>
            </div>
          </div>
        ))}
        <Input className="mx-4 mt-2" placeholder="Write a comment..." />
      </div>
    </div>
  );
}
