"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { useXmtp } from "@/hooks/useXmtp";
import { useEthersSigner } from "@/lib/utils";
import { Client } from "@xmtp/xmtp-js";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const signer = useEthersSigner();
  const { xmtp, setXmtp } = useXmtp();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    Client.create(signer!, { env: "dev" })
      .then(async (xmtp) => {
        setXmtp(xmtp);
        xmtp.enableGroupChat();
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />

      <div className="grow overflow-scroll max-h-screen">
        {xmtp ? (
          children
        ) : (
          <div className="min-h-screen flex justify-center items-center">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Button
                onClick={onClick}
                className="dark:bg-[#DD524C] dark:text-white hover:opacity-80 dark:hover:bg-[#DD524C] transition-all"
              >
                <Image
                  src={"https://xmtp.org/img/xmtp-sm-icon.png"}
                  unoptimized
                  width={64}
                  height={64}
                  className="w-5 h-5 mr-2"
                  alt="xmtp"
                />
                Enable XMTP Identity
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
