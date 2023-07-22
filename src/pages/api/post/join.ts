import { getAuth } from "@/auth/getAuth";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { Client, Conversation, GroupChat } from "@xmtp/xmtp-js";
import { useEthersSigner } from "@/lib/utils";
import { ethers } from "ethers";

interface Session {
  address: string;
}

const prisma = new PrismaClient();

const formSchema = z.object({
  topic: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // verify that the user is authenticated
  const session = (await getAuth(req, res)) as Session;

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log(req.body);

  const parsed = formSchema.safeParse(JSON.parse(req.body));

  console.log(parsed);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  const userAddress = session.address;

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string);
  console.log("signer address", signer.address);
  const xmtp = await Client.create(signer, { env: "dev" });
  xmtp.enableGroupChat();
  const list = await xmtp.conversations.list();
  const conv = list.find((conv) => conv.topic === parsed.data.topic);
  if (!conv) {
    return res.status(404).json({ error: "Not found" });
  }
  const groupChat = new GroupChat(xmtp, conv);
  groupChat.addMember(userAddress);
  return res.json({ true: true });
}
