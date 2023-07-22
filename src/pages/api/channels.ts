import { getAuth } from "@/auth/getAuth";
import { prisma } from "@/db";
import { NextApiRequest, NextApiResponse } from "next";

interface Session {
  address: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getAuth(req, res)) as Session;

  const userAddress = session.address;

  const rep = await prisma.allowed_address.findMany({
    where: {
      address: userAddress,
      hasJoined: true,
    },
    select: {
      channel: true,
    },
  });

  const arrayChannel = rep.flatMap((x) => x.channel);
  return res.json(arrayChannel);
}
