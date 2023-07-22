import { getAuth } from "@/auth/getAuth";
import { PrismaClient } from "@prisma/client";
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getAuth(req, res);
  console.log("query", req.query);
  console.log("body", req.body);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userAddress = session?.address;
  const prisma = new PrismaClient();
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
      return { ...post, msg: msg };
    })
  );
  console.log("rep", arr);
  // console.log("rep", (rep[0] as any).channel.posts);

  //   const arrayChannel = rep.flatMap((x) => x.channel);

  //   return res.json(arrayChannel);
  return res.json({ ok: "ok" });
}
