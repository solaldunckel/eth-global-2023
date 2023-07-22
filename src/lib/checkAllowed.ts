import { protocols } from "./protocols";

export function checkAllowed(
  addrInfo: {
    firstTxTimestamp: Date;
    toAddr: string[];
  },
  condition: { condition: string; category: string }
) {
  if (condition.category === "NFT") {
    // TO DO : check on chain if have nft
  } else if (condition.category === "protocol") {
    const key = condition.condition as keyof typeof protocols;

    protocols[key]?.forEach((protoAddr) => {
      addrInfo.toAddr.forEach((toAddr) => {
        if (protoAddr === toAddr) return true;
      });
    });
  } else if (condition.category === "OG") {
    const limit = new Date(condition.condition!);
    if (addrInfo.firstTxTimestamp.getTime() < limit.getTime()) return true;
  }

  return false;
}
