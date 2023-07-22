"use client";

import { Client } from "@xmtp/xmtp-js";
import { createContext, useContext } from "react";

export const XmtpContext = createContext<{
  xmtp: Client | undefined;
  setXmtp: (client: Client) => void;
} | null>(null);

export function useXmtp() {
  const ctx = useContext(XmtpContext);

  if (!ctx) {
    throw new Error("useXmtp must be used within XmtpProvider");
  }

  return ctx;
}
