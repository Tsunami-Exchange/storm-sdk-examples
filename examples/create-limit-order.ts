// Create limit order

import { Address } from "@ton/core";
import { TonClient, TonClient4 } from "@ton/ton";
import { getHttpEndpoint, getHttpV4Endpoint } from "@orbs-network/ton-access";

import { StormSDK, Direction, toStablecoin, numToNano } from "@storm-trade/sdk";

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

  // Getting increase position params
  const res = await sdk.createOrder({
    // Order type. 'stopLimit' is the type for both limit and stop-limit orders
    orderType: "stopLimit",

    // The amount of margin in stablecoins
    amount: toStablecoin(100),

    // The trader's address
    traderAddress: traderAddress,

    // Order's limit price. In 9 decimals.
    limitPrice: numToNano(0.6),

    // The leverage to use for the position (in 9 decimals).
    leverage: numToNano(2),

    // Order's expiration time. In seconds.
    expiration: Date.now() / 1000 + 60 * 60 * 24,

    // Order's stop price
    stopPrice: numToNano(0.6),

    // 0 for limit orders
    // stopPrice: numToNano(0),

    // The base asset to use for the position
    baseAsset: "TON",

    // The direction of the position (short or long)
    direction: Direction.short,

    // The stop trigger price for the opened position (optional)
    stopTriggerPrice: numToNano(1),

    // The take trigger price for the opened position (optional)
    takeTriggerPrice: numToNano(2),

    // A unique referral identifier for the position (optional).
    // Referral applies to position manager only at first time.
    referralId: 0,
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
