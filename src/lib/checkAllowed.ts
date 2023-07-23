import { prisma } from "@/db";
import { protocols } from "./protocols";
import { channel } from "@prisma/client";

export async function checkAllowed(userAddress: string, channel: channel) {
  if (channel.conditionType === "NFT") {
    const isAllowed = await prisma.allowed_address.findUnique({
      where: {
        channel_id_address: {
          channel_id: channel.id,
          address: userAddress,
        },
      },
    });
    if (isAllowed) return true;
  } else if (channel.conditionType === "OG") {
    const user = await prisma.users.findUnique({
      where: {
        address: userAddress,
      },
      select: {
        firstTxTimestamp: true,
      },
    });
    if (user?.firstTxTimestamp! < parseInt(channel.condition)) {
      return true;
    }
  } else if (channel.conditionType === "PROTOCOL") {
    const user = await prisma.users.findUnique({
      where: {
        address: userAddress,
      },
      select: {
        toAddr: true,
      },
    });
    const key = channel.condition as keyof typeof protocols;
    const array = JSON.parse(user!.toAddr) as string[];
    const isAllowed = protocols[key]?.find((addr) =>
      array.find((to) => to === addr)
    );
    if (isAllowed) return true;
  }

  return false;
}
