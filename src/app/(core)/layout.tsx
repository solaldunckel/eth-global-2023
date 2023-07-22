"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { useXmtp } from "@/hooks/useXmtp";
import { useEthersSigner } from "@/lib/utils";
import { Client } from "@xmtp/xmtp-js";
import { Loader2 } from "lucide-react";
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
              <Button onClick={onClick}>Enable XMTP Identity</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
