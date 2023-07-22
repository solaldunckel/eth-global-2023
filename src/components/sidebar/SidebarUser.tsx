"use client";

import { type FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import UpdateProfileForm from "./UpdateProfileForm";
import { Skeleton } from "../ui/skeleton";

const SidebarUser: FC = () => {
  const { data: session, update, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex flex-row items-center">
        <Skeleton className="h-10 w-10 rounded-full mr-2" />
        <div className="flex flex-col text-start gap-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
      </div>
    );
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex flex-row items-center overflow-hidden">
            <Avatar className="mr-2">
              <AvatarImage src={session?.user.image} className="object-cover" />
              <AvatarFallback>{session?.user.username?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-start">
              <h1 className="text-lg font-bold">
                {`@${session?.user.username}` ?? session?.address}
              </h1>
              <p className="text-xs font-light text-slate-300 overflow-ellipsis">
                {session?.address}
              </p>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>
            {`@${session?.user.username}` ?? session?.address}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <DialogTrigger asChild>
              <button className="flex flex-row items-center w-full">
                <User className="mr-2 h-4 w-4" />
                <span className="text-sm">Profile</span>
              </button>
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button
              className="flex flex-row items-center w-full"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="text-sm">Sign out</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {session && <UpdateProfileForm session={session} />}
    </Dialog>
  );
};

export default SidebarUser;
