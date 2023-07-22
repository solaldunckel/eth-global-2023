import { getAuth } from "@/auth/getAuth";
import { prisma } from "@/db";
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getAuth(req, res);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userAddress = session?.address;
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

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string);
  const xmtp = await Client.create(signer, { env: "dev" });
  xmtp.enableGroupChat(); // TO DO : take off, only one time ?
  const convList = await xmtp.conversations.list();

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
      msg.shift();
      return { ...post, ...decodedPost, comments: msg };
    })
  );

  return res.json(arr.filter(Boolean));
}
