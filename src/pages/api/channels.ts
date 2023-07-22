import { getAuth } from "@/auth/getAuth";
import { Channel, Message, Post } from "@/types";
import { PrismaClient } from "@prisma/client";
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

interface Session {
  address: string;
}

async function fillPost(topic_id: string) {
  console.log("fillPost", topic_id);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!);
  const xmtp = await Client.create(signer, { env: "dev" });
  // const convList = await xmtp?.conversations.list();
  // convList!.forEach((element) => {
  //   console.log(element.topic, ":", element.isGroup);
  // });

  xmtp.enableGroupChat(); // TO DO : take off, only one time ?

  return {
    authorId: "0x1235",
    content: "le contenu du post",
    title: "le titre du post",
    messages: [
      {
        authorId: "0x1235",
        content: "la reponse en  message",
        timestamp: 123456789,
      },
    ],
  } as Post;
}

// async function fillPosts(topics: { topic_id: string }[]) {
//   return await Promise.all(
//     topics.map(async (topic) => {
//       return await fillPost(topic.topic_id);
//     })
//   );
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getAuth(req, res)) as Session;

  const userAddress = session.address;
  const prisma = new PrismaClient();
  const rep = await prisma.allowed_address.findMany({
    where: {
      address: userAddress,
    },
    select: {
      channel: true,
    },
  });
  // console.log("rep", (rep[0] as any).channel.posts);

  const arrayChannel = rep.flatMap((x) => x.channel);
  console.log("arrayChannel", arrayChannel);
  return res.json(arrayChannel);
}
