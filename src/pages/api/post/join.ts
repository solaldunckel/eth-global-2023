import { getAuth } from "@/auth/getAuth";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { Client, GroupChat } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import { getXmtpClient } from "@/xmtp";

interface Session {
  address: string;
}

const formSchema = z.object({
  topic: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // verify that the user is authenticated
  const session = await getAuth(req, res);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("here");
  const parsed = formSchema.safeParse(JSON.parse(req.body));

  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  const userAddress = session.address;

  const xmtp = await getXmtpClient();

  const list = await xmtp.conversations.list();
  const conv = list.find((conv) => conv.topic === parsed.data.topic);

  if (!conv) {
    return res.status(404).json({ error: "Not found" });
  }

  const groupChat = new GroupChat(xmtp, conv);

  groupChat.addMember(userAddress);

  return res.json({ true: true });
}
