export async function getAddrInfo(address: string) {
  var api = require("etherscan-api").init(process.env.ETHERSCAN_API);
  const toAddr: string[] = [];

  const res = await api.account.txlist(address, 1, "latest", 1, 10000, "asc");

  const firstTxTimestamp = res.result[0].timeStamp * 1000;

  res.result.forEach((element: { from: string; to: any }) => {
    if (element.from === address.toLowerCase()) toAddr.push(element.to);
  });

  return { firstTxTimestamp, toAddr };
}
