/**
 * Close position
 *
 * This script demonstrates how to use the StormSDK to close an existing trading position on the jUSDT stablecoin pair using the closePosition method.
 */

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

  // Base asset where position is opened
  const baseAsset = "TON";

  // Get all trader's account data (positions, orders, referral info), related to specified Vault (provided in sdk) and Base asset
  const fullPositionData = await sdk.getPositionAccountData(
    traderAddress,
    baseAsset
  );

  // Getting increase position params
  const res = await sdk.closePosition({
    // The trader's address
    traderAddress: traderAddress,

    // The minimum base asset amount required for the position (optional)
    minQuoteAssetAmount: numToNano(0),

    // The base asset to use for the position
    baseAsset: "TON",

    // The direction of the position (short or long)
    direction: Direction.short,

    // Position size to close. Full size in this case
    size: fullPositionData?.longPosition?.positionData.size!,
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
