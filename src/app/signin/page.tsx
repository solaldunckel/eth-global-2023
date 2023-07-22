"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, type FC } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const SignIn: FC = () => {
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      redirect("/");
    }
  }, [status]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <ConnectButton />
    </div>
  );
};

export default SignIn;
