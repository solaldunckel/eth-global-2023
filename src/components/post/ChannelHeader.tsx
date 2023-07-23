import type { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { User } from "lucide-react";
import { Channel } from "@/types";
import { useChannel } from "@/hooks/useChannel";

type ChannelHeaderProps = {
  channel: Channel;
};

const ChannelHeader: FC<ChannelHeaderProps> = ({ channel }) => {
  console.log(channel.id);
  const { data } = useChannel(channel.id.toString());
  console.log(data);

  return (
    <div className="flex flex-row items-center">
      <Avatar className="h-32 w-32 border border-slate-500">
        <AvatarImage src={channel.image_url} className="object-cover" />
        <AvatarFallback>{channel.name[0]}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col justify-center ml-4 gap-2 ">
        <div className="flex flex-row items-center">
          <h1 className="text-4xl font-bold">{channel.name}</h1>
          <Badge className="h-6 ml-4" variant="default">
            {channel.category}
          </Badge>
        </div>

        <p className="text-xs font-light mr-8">{channel.description}</p>

        <div className="flex flex-row items-center mt-2">
          <User className="text-gray-500 mr-1 w-5 h-5" />
          <p className="text-sm text-gray-500 font-medium">
            {data?.nb_users} users
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChannelHeader;
