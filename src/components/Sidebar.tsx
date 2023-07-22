import type { FC } from "react";
import { Button } from "./ui/button";
import { mockDataChannels, mockDataCurrentUser } from "@/mockData";
import { Channel } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

type SidebarChannelButtonProps = {
  channel: Channel;
};

const SidebarChannelButton: FC<SidebarChannelButtonProps> = ({ channel }) => {
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

const Sidebar: FC = () => {
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
            {mockDataChannels.map((channel) => (
              <SidebarChannelButton channel={channel} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center">
        <Avatar className="mr-2">
          <AvatarImage
            src={mockDataCurrentUser.image_url}
            className="object-cover"
          />
          <AvatarFallback>{mockDataCurrentUser.name}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">{mockDataCurrentUser.name}</h1>
          <p className="text-xs font-light text-slate-300">
            {mockDataCurrentUser.address}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;