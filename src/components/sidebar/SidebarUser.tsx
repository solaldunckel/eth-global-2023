"use client";

import { useEffect, type FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { mockDataCurrentUser } from "@/mockData";
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
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import UpdateProfileForm from "./UpdateProfileForm";
import { useXmtp } from "@/hooks/useXmtp";
import { Client } from "@xmtp/xmtp-js";
import { useEthersSigner } from "@/lib/utils";

const SidebarUser: FC = () => {
  const { data: session, update } = useSession();
  const signer = useEthersSigner();
  const { setXmtp } = useXmtp();

  useEffect(() => {
    Client.create(signer!, { env: "production" }).then((xmtp) => {
      // setXmtp(xmtp);
      xmtp.enableGroupChat();
    });
  }, [setXmtp, signer]);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex flex-row items-center">
            <Avatar className="mr-2">
              <AvatarImage src={session?.user.image} className="object-cover" />
              <AvatarFallback>{mockDataCurrentUser.name}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-start">
              <h1 className="text-lg font-bold">
                {`@${session?.user.username}` ?? session?.address}
              </h1>
              <p className="text-xs font-light text-slate-300">
                {mockDataCurrentUser.address}
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

      <UpdateProfileForm />
    </Dialog>
  );
};

export default SidebarUser;
