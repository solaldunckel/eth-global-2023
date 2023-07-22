import { getAuth } from "@/auth/getAuth";
import { prisma } from "@/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getAuth(req, res);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const channels = await prisma.channel.findMany();

  // TODO: add a boolean if the user is allowed to join the channel

  return res.json(channels);
}
