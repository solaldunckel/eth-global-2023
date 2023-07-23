import { prisma } from "@/db";
import { getAddrInfo } from "@/lib/getAddrInfo";
import { GetNftHoldersQuery } from "@/lib/queries";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const schema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  image_url: z.string().optional(),
  conditionCategory: z.enum(["NFT", "OG", "POAP"]),
  conditionAddress: z.string().optional(),
  conditionDate: z.string().optional(),
  conditionEventId: z.string().optional(),
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

  if (parsed.data.conditionCategory === "NFT") {
    await nftChannel(parsed.data);
  } else if (parsed.data.conditionCategory === "OG") {
    await ogChannel(parsed.data);
  } else if (parsed.data.conditionCategory === "POAP") {
    await poapChannel(parsed.data);
  }

  return res.status(200).json({ success: true });
}

async function nftChannel(parsed: z.infer<typeof schema>) {
  if (!parsed.title || !parsed.category || !parsed.description) {
    throw new Error("Missing field");
  }

  const addresses = await getNftHolders(
    parsed.conditionAddress!,
    parsed.blockchain!
  );

  const newChannel = await prisma.channel.create({
    data: {
      name: parsed.title,
      category: parsed.category,
      description: parsed.description,
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
      image_url: parsed.image_url,
      condition: parsed.conditionDate!,
      conditionType: "OG",
    },
  });
}

async function poapChannel(parsed: z.infer<typeof schema>) {
  const { addresses, metadata } = await getPoapHolders(
    parsed.conditionEventId!
  );

  if (!metadata) throw new Error("No metadata for POAP");

  const newChannel = await prisma.channel.create({
    data: {
      name: metadata?.eventName,
      category: "POAP",
      description: metadata?.description,
      image_url: metadata?.contentValue?.image.large,
      condition: parsed.conditionEventId!,
      conditionType: "POAP",
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
    } else nextPage = data.TokenBalances.pageInfo.nextCursor;

    await sleep(220);
  }
  return addresses;
}

async function getPoapHolders(eventId: string) {
  const gqlQuery = `query POAPEventAttendees($eventId: String!) {
    Poaps(input: {filter: {eventId: { _eq: $eventId}}, blockchain: ALL, limit: 200}) {
      Poap {
        owner {
          identity
        }
        poapEvent {
          eventName
          description
          contentValue {
            image {
              large
            }
          }
        }
      }
      pageInfo {
        nextCursor
      }
    }
  }`;

  let holders: string[] = [];
  let nextPage: string | null = null;
  let metadata: {
    eventName: string;
    description: string;
    contentValue: {
      image: {
        large: string;
      };
    };
  } | null = null;

  while (nextPage !== "") {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        query: gqlQuery,
        variables: {
          eventId,
          cursor: nextPage,
        },
      }),
    });

    const json = await res.json();
    const data: {
      Poaps: {
        Poap: {
          owner: { identity: string };
          poapEvent: {
            eventName: string;
            description: string;
            contentValue: {
              image: {
                large: string;
              };
            };
          };
        }[];
        pageInfo: { nextCursor: string };
      };
    } = json?.data;

    if (json.errors) {
      console.log("ERROR"); // TO DO : handle error
    }

    if (!metadata && data.Poaps.Poap[0].poapEvent) {
      metadata = data.Poaps.Poap[0].poapEvent;
    }

    data.Poaps.Poap.forEach((poap) => {
      holders.push(poap.owner.identity);
    });

    nextPage = data.Poaps.pageInfo.nextCursor;
    await sleep(200);
  }

  return { addresses: holders, metadata };
}

// sleep function to avoid rate limit
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
