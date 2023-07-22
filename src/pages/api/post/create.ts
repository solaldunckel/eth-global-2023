import { getAuth } from "@/auth/getAuth";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { Client, Conversation } from "@xmtp/xmtp-js";
import { useEthersSigner } from "@/lib/utils";
import { ethers } from "ethers";

interface Session {
  address: string;
}

const prisma = new PrismaClient();

const formSchema = z.object({
  channelId: z.coerce.number(),
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

  // parse body
  const parsed = formSchema.safeParse(JSON.parse(req.body));

  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  // verify that the user is allowed to post in this channel

  const userAddress = session.address;

  const isAllowed = await prisma.allowed_address.findUnique({
    where: {
      channel_id_address: {
        address: userAddress,
        channel_id: parsed.data.channelId,
      },
    },
  });

  const allowedList = await prisma.allowed_address.findMany({
    where: {
      channel_id: parsed.data.channelId,
    },
  });

  if (!isAllowed) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("isAllowed", isAllowed);
  console.log("userAddress", userAddress);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string);
  console.log("signer address", signer.address);
  const xmtp = await Client.create(signer, { env: "dev" });
  xmtp.enableGroupChat();

  const groupConversation = await xmtp.conversations.newGroupConversation([
    signer.address,
    ...allowedList.map((allowed) => allowed.address),
  ]);

  const writeDb = await prisma.posts.create({
    data: {
      channel: {
        connect: {
          id: parsed.data.channelId,
        },
      },
      topic_id: groupConversation.topic,
      author_address: userAddress,
    },
  });

  console.log("topic generated :", groupConversation.topic);

  return res.json({ topic: groupConversation.topic });
}
