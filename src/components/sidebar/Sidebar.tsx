"use client";

import type { FC } from "react";
import { Button } from "../ui/button";
import { mockDataChannels, mockDataCurrentUser } from "@/mockData";
import { Channel } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import SidebarUser from "./SidebarUser";
import { useQuery } from "@tanstack/react-query";

type SidebarChannelButtonProps = {
  channel: Channel;
};

const SidebarChannelButton: FC<SidebarChannelButtonProps> = ({ channel }) => {
  console.log(channel);
  return (
    <Link
      href={`/channel/${channel.id}`}
      className="flex flex-row items-center hover:bg-white/20 rounded transition-all py-1 px-2 text-start"
    >
      <Avatar className="mr-2">
        <AvatarImage src={channel.image_url} className="object-cover" />
        <AvatarFallback>{channel.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="font-bold text-base">{channel.name}</p>
        <p className="text-sm text-gray-500 font-light">2 new posts</p>
      </div>
    </Link>
  );
};

const fetchChannels = async () => {
  const res = await fetch("/api/channels");
  return res.json();
};

const Sidebar: FC = () => {
  const { data } = useQuery({
    queryKey: ["channels"],
    queryFn: fetchChannels,
  }) as { data: Channel[] };

  // const data = mockDataChannels;
  return (
    <div className="w-72 p-4 flex flex-col gap-4 border-r-2 border-gray-500/10 h-screen">
      <div className="grow flex flex-col gap-4">
        <div className="h-24 border border-white ">company logo</div>
        <Button variant="outline" asChild>
          <Link href="/">Discover</Link>
        </Button>

        <div className="flex flex-col">
          <h2 className="font-bold text-xl mb-2">My channels</h2>
          <div className="flex flex-col gap-2">
            {data?.map((channel, index) => (
              <SidebarChannelButton channel={channel} key={index} />
            ))}
          </div>
        </div>
      </div>

      <SidebarUser />
    </div>
  );
};

export default Sidebar;
