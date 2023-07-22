import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";

const globalForXmtp = globalThis as unknown as {
  xmtp: Client | undefined;
};

export const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string);

export async function getXmtpClient() {
  const xmtp =
    globalForXmtp.xmtp ?? (await Client.create(signer, { env: "dev" }));

  if (process.env.NODE_ENV !== "production") globalForXmtp.xmtp = xmtp;

  xmtp.enableGroupChat();

  return xmtp;
}
