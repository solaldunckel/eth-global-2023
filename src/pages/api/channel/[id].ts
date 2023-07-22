import { getAuth } from "@/auth/getAuth";
import { prisma } from "@/db";
import { getXmtpClient } from "@/xmtp";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getAuth(req, res);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const rep = await prisma.channel.findUnique({
    where: {
      id: parseInt(req.query.id as string),
    },
    include: {
      posts: true,
    },
  });

  if (!rep) {
    return res.status(404).json({ error: "Not found" });
  }

  if (req.method === "POST") {
    const canJoin = await prisma.allowed_address.findUnique({
      where: {
        channel_id_address: {
          address: session.address,
          channel_id: parseInt(req.query.id as string),
        },
      },
    });

    if (!canJoin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await prisma.allowed_address.update({
      where: {
        channel_id_address: {
          address: session.address,
          channel_id: parseInt(req.query.id as string),
        },
      },
      data: {
        hasJoined: true,
      },
    });

    return res.status(200).json({ success: true });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const xmtp = await getXmtpClient(); // TO DO : take off, only one time ?
  const convList = await xmtp.conversations.list();

  const allUsers = await prisma.users.findMany({});
  const nb_users = await prisma.allowed_address.count({
    where: {
      channel_id: parseInt(req.query.id as string),
      hasJoined: true,
    },
  });
  if (!allUsers) {
    return res.status(404).json({ error: "Not found" });
  }

  const arr = await Promise.all(
    rep.posts.map(async (post) => {
      const conv = convList.find((conv) => post.topic_id === conv.topic);

      if (!conv) return null;

      const msg = await conv.messages();

      if (!msg || msg.length === 0) return null;

      const decodedPost = JSON.parse(msg[0].content) as {
        title: string;
        content: string;
      } | null;

      const firstMsg = msg.shift();
      return {
        ...post,
        author: allUsers.find((user) => user.address === post.author_address),
        timestamp: firstMsg?.conversation.createdAt,
        ...decodedPost,
        comments: msg
          .filter((msg) => msg.contentType.typeId === "text")
          .map((comment) => ({
            author: allUsers.find(
              (user) => user.address === comment.senderAddress
            ),
            content: comment.content,
            timestamp: comment.sent,
          })),
      };
    })
  );

  return res.json({ ...rep, nb_users, posts: arr.filter(Boolean) });
}
