"use client";

import type { FC } from "react";
import { Button } from "../ui/button";
import { Channel } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import SidebarUser from "./SidebarUser";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import FunnelLogo from "../../../public/funnel.png";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CreateChannel from "../CreateChannel";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { getBadgeColor } from "@/lib/getBadgeColor";

type SidebarChannelButtonProps = {
  channel: Channel;
};

const SidebarChannelButton: FC<SidebarChannelButtonProps> = ({ channel }) => {
  return (
    <Link
      href={`/channel/${channel.id}`}
      className="flex flex-row items-center hover:bg-white/20 rounded transition-all py-1 px-2 text-start"
    >
      <Avatar className="mr-2 h-12 w-12">
        <AvatarImage src={channel.image_url} className="object-cover" />
        <AvatarFallback>{channel.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="font-bold text-base">{channel.name}</p>
        <Badge
          className={cn("mt-1 self-start", getBadgeColor(channel.category))}
        >
          {channel.category}
        </Badge>
      </div>
    </Link>
  );
};

const SidebarChannelButtonSkeleton: FC = () => {
  return (
    <div className="flex flex-row py-1 px-2">
      <Skeleton className="rounded-full mr-2 h-10 w-10" />
      <div className="flex flex-col">
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  );
};

const fetchChannels = async () => {
  const res = await fetch("/api/channels");
  return res.json() as Promise<Channel[]>;
};

const Sidebar: FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["channels"],
    queryFn: fetchChannels,
  });

  // const data = mockDataChannels;
  return (
    <div className="w-[300px] p-4 flex flex-col gap-4 border-r-2 border-gray-500/10 h-screen">
      <div className="grow flex flex-col gap-4">
        <div className="h-24 justify-center items-center flex">
          <Image src={FunnelLogo} alt="logo" className="w-[256px]" />
        </div>
        <Button
          variant="outline"
          className="dark:from-[#64B696] dark:to-[#796CB6] dark:bg-gradient-to-r hover:opacity-50 transition-all"
          asChild
        >
          <Link href="/">Discover</Link>
        </Button>

        <div className="flex flex-col">
          <h2 className="font-bold text-xl mb-2">My channels</h2>
          <div className="flex flex-col gap-2">
            {data?.length === 0 && (
              <p className="text-sm text-gray-500 font-light">
                You have no channels yet
              </p>
            )}
            {isLoading && <SidebarChannelButtonSkeleton />}
            {data?.map((channel, index) => (
              <SidebarChannelButton channel={channel} key={index} />
            ))}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="mt-4">
                Create a channel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Create a Channel</DialogTitle>
              <CreateChannel />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <SidebarUser />
    </div>
  );
};

export default Sidebar;
