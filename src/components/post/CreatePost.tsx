"use client";

import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConversation } from "@/hooks/useConversation";
import { Channel } from "@/types";

type CreatePostProps = {
  channelId: number;
};

const schema = z.object({
  title: z.string().nonempty({ message: "A title is required" }),
  content: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const mutationFn = async (values: FormValues & { channelId: number }) => {
  return fetch("/api/post/create", {
    method: "POST",
    body: JSON.stringify(values),
  }).then((res) => res.json() as Promise<{ topic: string }>);
};

const CreatePost: FC<CreatePostProps> = ({ channelId }) => {
  const { refetch } = useConversation();

  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn,
    onSuccess: async (res, { channelId, title, content }) => {
      const { data: conversations } = await refetch();

      const topic = conversations?.find((post) => post.topic === res.topic);

      if (!topic) {
        throw new Error("Topic not found");
      }

      topic
        .send(JSON.stringify({ title: title, content: content }))
        .then(() => {
          document.getElementById("closeDialog")?.click();
          queryClient.setQueryData<Channel>(
            ["channel", channelId],
            (oldData: any) => {
              if (!oldData) {
                return oldData;
              }

              return {
                ...oldData,
                posts: [
                  ...oldData.posts,
                  {
                    topic_id: res.topic,
                    author: {
                      username: "me",
                      image: "https://i.pravatar.cc/300",
                      address: "me",
                    },
                    title,
                    content,
                    channel_id: channelId,
                    author_address: "me",
                    comments: [],
                    timestamp: new Date().toISOString(),
                  },
                ],
              };
            }
          );
          queryClient.invalidateQueries(["channel", channelId]);
        });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  function onSubmit(values: FormValues) {
    createPostMutation.mutate({
      ...values,
      channelId,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create a Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Post Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Post Content (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={createPostMutation.isLoading} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
