//  Create a Take-profit/stop-loss order

import { Address } from "@ton/core";
import { TonClient, TonClient4 } from "@ton/ton";
import { getHttpEndpoint, getHttpV4Endpoint } from "@orbs-network/ton-access";

import { StormSDK, Direction, numToNano } from "@storm-trade/sdk";

async function main() {
  // Trader address
  const traderAddress = Address.parse(
    "UQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqEBI"
  );

  // Init http-v2 TON api (TON Access in this case)
  const client = new TonClient({ endpoint: await getHttpEndpoint() });

  // Or http-v4 api. You can use any of them.
  const client4 = new TonClient4({ endpoint: await getHttpV4Endpoint() });

  // Init mainnet jUSDT SDK with ton client:
  const sdk = StormSDK.asMainnetJUSDT(client);

  const baseAsset = "TON";

  // Get all trader's account data (positions, orders, referral info), related to specified Vault (provided in sdk) and Base asset
  const fullPositionData = await sdk.getPositionAccountData(
    traderAddress,
    baseAsset
  );

  // Getting create Take-profit/Stop-loss order params:
  const res = await sdk.createOrder({
    // Order type
    orderType: "takeProfit",

    // options below are ... for `orderType: 'stopLoss'`

    // The trader's address
    traderAddress: traderAddress,

    // // Order's expiration time. In seconds.
    expiration: Date.now() / 1000 + 60 * 60 * 24,

    // // The direction of the position (short or long)
    direction: Direction.short,

    // Triger price to execute the order. In 9 decimals.
    trigerPrice: numToNano(3),

    // The amount of position to close with this order (half in this case).
    amount: fullPositionData?.shortPosition?.positionData.size! / 2n,

    baseAsset: baseAsset,
  });

  // 'res' contains everything needed for sending TX to blockchain, such as:

  // TX's address
  console.log(res.to);
  // TX's message body
  console.log(res.body);
  // TX's message value
  console.log(res.value);
}

main();
