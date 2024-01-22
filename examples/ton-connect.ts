// TON Connect

// This TypeScript code demonstrates an example of using the TON Connect V2 protocol to send an increase position transaction on the TON blockchain via our SDK (StormSDK).

// It is important to note that this example assumes a user has connected their wallet via TonConnect Wallet, and the script does not handle any error cases or edge conditions.

import { Address } from "@ton/core";
import { TonClient, TonClient4 } from "@ton/ton";
import { getHttpEndpoint, getHttpV4Endpoint } from "@orbs-network/ton-access";
import { TonConnect } from "@tonconnect/sdk";

import { StormSDK, Direction, numToNano, toStablecoin } from "@storm-trade/sdk";

async function main() {
  // Init http-v2 TON api (TON Access in this case)
  const client = new TonClient({ endpoint: await getHttpEndpoint() });
  // Or http-v4 api. You can use any of them.
  const client4 = new TonClient4({ endpoint: await getHttpV4Endpoint() });

  // Init TON Connect
  const connector = new TonConnect();

  // Suppose out user has already connected...

  const traderAddress = Address.parse(connector.account?.address!);

  // Init mainnet jUSDT SDK with ton client:
  const sdk = StormSDK.asMainnetJUSDT(client4);

  // Getting increase position params
  const res = await sdk.increasePosition({
    amount: toStablecoin(100),
    traderAddress: traderAddress,
    leverage: numToNano(2),
    baseAsset: "TON",
    direction: Direction.short,
    stopTriggerPrice: numToNano(2),
    takeTriggerPrice: numToNano(3),
  });

  // Now send TX via TON Connect sendTransaction:
  connector.sendTransaction({
    validUntil: Date.now() / 1000 + 60 * 5,
    messages: [
      {
        address: res.to.toString(),
        amount: res.value.toString(),
        payload: res.body.toBoc().toString("base64"),
      },
    ],
  });
}

main();
