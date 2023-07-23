import { prisma } from "@/db";
import { getAddrInfo } from "@/lib/getAddrInfo";
import { GetNftHoldersQuery } from "@/lib/queries";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const schema = z.object({
  title: z.string().nonempty({ message: "A title is required" }),
  description: z.string(),
  category: z.string(),
  image_url: z.string().optional(),
  conditionCategory: z.enum(["NFT", "OG"]),
  conditionAddress: z.string().optional(),
  conditionDate: z.string().optional(),
  blockchain: z.enum(["ethereum", "polygon"]).optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsed = schema.safeParse(JSON.parse(req.body));
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  if (parsed.data.conditionCategory === "NFT") await nftChannel(parsed.data);
  else await ogChannel(parsed.data);

  return res.status(200).json({ success: true });
}

async function nftChannel(parsed: z.infer<typeof schema>) {
  const addresses = await getNftHolders(
    parsed.conditionAddress!,
    parsed.blockchain!
  );

  const newChannel = await prisma.channel.create({
    data: {
      name: parsed.title,
      category: parsed.category,
      description: parsed.description,
      query: "",
      image_url: parsed.image_url,
      condition: parsed.conditionAddress!,
      conditionType: "NFT",
    },
  });

  await prisma.allowed_address.createMany({
    data: [
      ...addresses.map((address) => ({
        address,
        channel_id: newChannel.id,
        hasJoined: false,
      })),
    ],
  });
}

async function ogChannel(parsed: z.infer<typeof schema>) {
  const newChannel = await prisma.channel.create({
    data: {
      name: parsed.title,
      category: parsed.category,
      description: parsed.description,
      query: "",
      image_url: parsed.image_url,
      condition: parsed.conditionDate!,
      conditionType: "OG",
    },
  });
}

const apiKey = process.env.AIRSTACK_API_KEY as string;
const API = "https://api.airstack.xyz/gql";

type TokenBalance = { owner: { addresses: string[] } };
type ResAirStack = {
  TokenBalances: {
    TokenBalance: TokenBalance[];
    pageInfo: { nextCursor: string; prevCursor: string };
  };
};

async function getNftHolders(tokenAddress: string, blockchain: string) {
  let addresses: string[] = [];
  let end = false;
  let nextPage: string | null = null;

  while (end === false) {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        query: GetNftHoldersQuery,
        variables: {
          address: tokenAddress,
          blockchain,
          cursor: nextPage,
        },
      }),
    });

    const json = await res.json();
    const data: ResAirStack = json?.data;

    if (json.errors) {
      console.log("ERROR"); // TO DO : handle error
    }

    data.TokenBalances.TokenBalance?.forEach((balance) => {
      addresses.push(balance.owner.addresses[0]);
    });

    if (!data.TokenBalances.pageInfo.nextCursor) {
      end = true;
      console.log(end);
    } else nextPage = data.TokenBalances.pageInfo.nextCursor;
    console.log(data.TokenBalances.pageInfo.nextCursor);
    console.log("coucou");
    await sleep(2000);
  }
  return addresses;
}

// sleep function to avoid rate limit
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
