import { GetNftHoldersQuery } from "@/lib/queries";

const apiKey = process.env.NEXT_PUBLIC_AIRSTACK_API_KEY as string;
const API = "https://api.airstack.xyz/gql";

type TokenBalance = { owner: { addresses: string[] } };
type ResAirStack = {
  TokenBalances: {
    TokenBalance: TokenBalance[];
    pageInfo: { nextCursor: string; prevCursor: string };
  };
};

export async function useGetNftHolders(
  tokenAddress: string,
  blockchain: string
) {
  let addresses: string[] = [];
  let end = false;
  let nextPage: string = "";

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
          nextPage,
        },
      }),
    });

    const json = await res.json();
    const data: ResAirStack = json?.data;

    if (json.errors) {
      console.log("ERROR"); // TO DO : handle error
    }

    data.TokenBalances.TokenBalance.forEach((balance) => {
      addresses.push(balance.owner.addresses[0]);
    });

    if (!data.TokenBalances.pageInfo.nextCursor) {
      end = true;
      console.log(end);
    } else nextPage = data.TokenBalances.pageInfo.nextCursor;
  }

  return addresses;
}
