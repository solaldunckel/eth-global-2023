import CreatePost from "@/components/post/CreatePost";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockDataChannels } from "@/mockData";
import { User } from "lucide-react";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const channel = mockDataChannels.find((channel) => channel.id === params.id);

  if (!channel) {
    return <div>Channel not found</div>;
  }

  return (
    <div className="p-8">
      <div className="flex flex-row items-center">
        <Avatar className="h-32 w-32 border border-slate-500">
          <AvatarImage src={channel.image_url} className="object-cover" />
          <AvatarFallback>{channel.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col justify-center ml-4 gap-4">
          <div className="flex flex-row items-center">
            <h1 className="text-4xl font-bold">{channel.name}</h1>
            <Badge className="h-6 ml-4" variant="default">
              {channel.category}
            </Badge>
          </div>

          <div className="flex flex-row items-center">
            <User className="text-gray-500 mr-1" />
            <p className="text-sm text-gray-500 font-bold">23</p>
          </div>
        </div>

        <div className="ml-auto">
          <CreatePost channelId={channel.id} />
        </div>
      </div>

      {children}
    </div>
  );
}
