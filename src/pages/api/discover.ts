import { getAuth } from "@/auth/getAuth";
import { prisma } from "@/db";
import { checkAllowed } from "@/lib/checkAllowed";
import { getAddrInfo } from "@/lib/getAddrInfo";
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

  const addrInfo = await getAddrInfo(session.address);

  const filtered = channels.map((channel) => {
    const accessStatus = channel.allowed_address.find(
      (el) => el.address === session.address
    )?.hasJoined
      ? "joined"
      : true // TO DO : channel category ?
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
