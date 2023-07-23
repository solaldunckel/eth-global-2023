import { getAuth } from "@/auth/getAuth";
import { prisma } from "@/db";
import { checkAllowed } from "@/lib/checkAllowed";
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

  const filtered = await Promise.all(
    channels.map(async (channel) => {
      const accessStatus = channel.allowed_address.find(
        (el) => el.address.toLowerCase() === session.address.toLowerCase()
      )?.hasJoined
        ? "joined"
        : (await checkAllowed(session.address, channel)) // TO DO : channel category ?
        ? "allowed"
        : "denied";
      return {
        ...channel,
        allowed_address: undefined,
        accessStatus,
      };
    })
  );

  return res.json(filtered);
}
