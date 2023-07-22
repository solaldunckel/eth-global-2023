"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useChannel } from "@/hooks/useChannel";
import { useXmtp } from "@/hooks/useXmtp";
import { getTimeElapsed } from "@/lib/getTimeElapsed";
import { useForm } from "react-hook-form";

export default function Page({
  params,
}: {
  params: { id: string; topicId: string };
}) {
  const { data } = useChannel(params.id);
  const { xmtp } = useXmtp();
  const decoded = decodeURIComponent(params.topicId);

  const wantedPost = data?.posts.find(
    (post) => post.topic_id.split("/")[3] === decoded
  );

  const form = useForm({
    defaultValues: {
      message: "",
    },
  });

  const comments = wantedPost?.comments.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  console.log(comments);

  const onSubmit = async (data: any) => {
    const posts = await xmtp?.conversations.list();
    const xmtpConv = posts?.find((postFromList) => {
      console.log(postFromList.topic, "vs", wantedPost?.topic_id);
      return postFromList.topic === wantedPost?.topic_id;
    });
    xmtpConv?.send(data.message);

    form.reset();
  };

  return (
    <div className="flex flex-col mt-8">
      <div className="flex flex-col bg-[#171717] rounded p-4 border border-gray-500/25">
        <h1 className="text-2xl font-bold mt-1">{wantedPost?.title}</h1>
        <div className="mt-4 text-sm" style={{ whiteSpace: "pre-line" }}>
          {wantedPost?.content}
        </div>
        <div className="flex flex-row items-center text-start mt-4">
          <div className="text-xs text-gray-500">
            posted{" "}
            <span className="font-bold">
              {getTimeElapsed(wantedPost!.timestamp)}
            </span>{" "}
            by <span className="font-bold">{wantedPost?.author_address}</span>
          </div>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="mt-2"
                    placeholder="Write a comment..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="flex flex-col mt-4">
        {comments?.map((comment, index) => (
          <div key={index} className="flex flex-row gap-2 p-4">
            <div className="h-10 w-10 rounded-full bg-green-500"></div>
            <div className="flex flex-col bg-[#171717] border border-gray-500/25 p-4 rounded-lg">
              <div className="flex flex-row items-center">
                <h1 className="font-bold text-sm">{comment.author_address}</h1>
                <p className="text-xs  text-gray-500 font-light">
                  <span className="px-2">{"•"}</span>
                  {getTimeElapsed(comment.timestamp)}
                </p>
              </div>
              <p className="text-sm font-light">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
