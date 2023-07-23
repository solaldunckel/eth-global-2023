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
import { useConversation } from "@/hooks/useConversation";
import { useXmtp } from "@/hooks/useXmtp";
import { getTimeElapsed } from "@/lib/getTimeElapsed";
import { Channel } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Page({
  params,
}: {
  params: { id: string; topicId: string };
}) {
  const { data } = useChannel(Number(params.id));
  const { xmtp } = useXmtp();
  const decoded = decodeURIComponent(params.topicId);
  const { data: conversations } = useConversation();

  console.log(data);
  console.log(data?.posts);
  console.log(decoded);

  const wantedPost = data?.posts.find(
    (post) => post.topic_id.split("/")[3] === decoded
  );

  const queryClient = useQueryClient();

  const conversation = useMemo(() => {
    return conversations?.find((conv) => {
      return conv.topic.split("/")[3] === decoded;
    });
  }, [conversations, decoded]);

  const form = useForm({
    defaultValues: {
      message: "",
    },
  });

  const { data: session } = useSession();

  const comments = useMemo(
    () =>
      wantedPost?.comments.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    [wantedPost?.comments]
  );

  const onSubmit = async (data: any) => {
    conversation?.send(data.message);
    queryClient.setQueryData(
      ["channel", Number(params.id)],
      (old: Channel | undefined) => {
        if (!old) return;

        return {
          ...old,
          posts: old?.posts.map((post) => {
            return {
              ...post,
              comments: [
                ...post.comments,
                {
                  author: {
                    address: session?.address!,
                    username: session?.user.username,
                    profile_pic_url: session?.user.image,
                  },
                  content: data.message,
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          }),
        };
      }
    );
    queryClient.invalidateQueries(["channel", Number(params.id)]);
    form.reset();
  };

  useEffect(() => {
    if (!conversation || !xmtp) return;

    async function init() {
      for await (const message of await conversation!.streamMessages()) {
        if (message.contentType.typeId !== "text") {
          continue;
        }

        console.log("NEW MESSAGE");

        queryClient.invalidateQueries(["channel", Number(params.id)]);
      }
    }

    init();
  }, [conversation, xmtp]);

  if (!wantedPost) {
    return null;
  }

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
              {getTimeElapsed(wantedPost.timestamp)}
            </span>{" "}
            by{" "}
            <span className="font-bold">
              {wantedPost?.author.username ?? wantedPost?.author.address}
            </span>
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
        {comments && comments.length === 0 && (
          <p className="text-sm text-gray-500 font-light">
            There are no comments yet
          </p>
        )}
        {comments?.map((comment, index) => (
          <div key={index} className="flex flex-row gap-2 p-4">
            {comment.author.profile_pic_url ? (
              <Image
                alt="profile picture"
                src={comment.author.profile_pic_url}
                width={40}
                height={40}
                unoptimized
                className="h-10 w-10 rounded-full bg-green-500 object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-green-500"></div>
            )}
            <div className="flex flex-col bg-[#171717] border  border-gray-500/25 p-4 rounded-lg">
              <div className="flex flex-row items-center pb-2">
                <h1 className="font-bold text-sm">
                  {comment.author.username ?? comment.author.address}
                </h1>
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
