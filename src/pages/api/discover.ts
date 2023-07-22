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

  const channels = await prisma.channel.findMany({
    include: {
      allowed_address: true,
    },
  });

  console.log(channels[0].allowed_address);

  const filtered = channels.map((channel) => {
    const accessStatus = channel.allowed_address.find(
      (el) => el.address === session.address
    )?.hasJoined
      ? "joined"
      : channel.allowed_address.some(
          (allowed) => allowed.address === session.address
        )
      ? "allowed"
      : "denied";
    return {
      ...channel,
      allowed_address: undefined,
      accessStatus,
    };
  });

  return res.json(filtered);
}
