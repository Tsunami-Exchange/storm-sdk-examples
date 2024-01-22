/**
 * Add margin
 *
 * This script demonstrates how to use the StormSDK to add margin to an existing trading position on the jUSDT stablecoin pair using the addMargin method.
 */

import { Address } from "@ton/core";
import { TonClient, TonClient4 } from "@ton/ton";
import { getHttpEndpoint, getHttpV4Endpoint } from "@orbs-network/ton-access";

import { StormSDK, Direction, toStablecoin } from "@storm-trade/sdk";

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

  // Getting add margin params
  const res = await sdk.addMargin({
    // The amount of margin in stablecoins
    amount: toStablecoin(100),

    // The trader's address
    traderAddress: traderAddress,

    // The base asset to use for the position
    baseAsset: "TON",

    // The direction of the position (short or long)
    direction: Direction.short,
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
