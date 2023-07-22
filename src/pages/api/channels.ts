import { getAuth } from "@/auth/getAuth";
import { Channel, Message, Post } from "@/types";
import { PrismaClient } from "@prisma/client";
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
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
  const prisma = new PrismaClient();
  const rep = await prisma.allowed_address.findMany({
    where: {
      address: userAddress,
    },
    select: {
      channel: true,
    },
  });

  const arrayChannel = rep.flatMap((x) => x.channel);
  return res.json(arrayChannel);
}
