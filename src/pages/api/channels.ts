import { getAuth } from "@/auth/getAuth";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
      channel: {
        select: { category: true, name: true, threads: true },
      },
    },
  });

  return res.json(rep.flatMap((x) => x.channel));
}
