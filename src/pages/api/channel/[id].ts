import { getAuth } from "@/auth/getAuth";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

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
      channel: {
        select: { category: true, name: true, posts: true },
      },
    },
  });
  // console.log("rep", (rep[0] as any).channel.posts);

  const arrayChannel = rep.flatMap((x) => x.channel);

  return res.json(arrayChannel);
}
