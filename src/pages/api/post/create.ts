import { getAuth } from "@/auth/getAuth";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getXmtpClient, signer } from "@/xmtp";
import { prisma } from "@/db";

const formSchema = z.object({
  channelId: z.coerce.number(),
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

  if (!isAllowed) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const allowedList = await prisma.allowed_address.findMany({
    where: {
      channel_id: parsed.data.channelId,
      hasJoined: true,
    },
  });

  const xmtp = await getXmtpClient();

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
