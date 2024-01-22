// Sync packing methods

// This example shows how to synchronously increase a position using the [methodName]Params methods provided by our SDK. These methods are designed to improve performance because they package all the necessary parameters locally and prepare the parameters before sending the TX and do not require retrieving all the necessary static blockchain data each time.
// Keep in mind that our SDK offers similar methods (e.g., closePositionParams, removeMarginParams, addMarginParams, createOrderParams, and cancelOrderParams) for other operations.

import { Address } from "@ton/core";
import { TonClient, TonClient4 } from "@ton/ton";
import { getHttpEndpoint, getHttpV4Endpoint } from "@orbs-network/ton-access";

import { StormSDK, Direction, numToNano, toStablecoin } from "@storm-trade/sdk";

async function main() {
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

  // Obtain static data, such as addresses (position address, quote jetton address, lp address) and asset detailed info.
  const staticData = await sdk.getStaticData(traderAddress, baseAsset);

  // There is no need to refresh static data (except isPositionManagerInited, which will be 'true' after the very first position interaction though).
  // Addresses and asset info will remain the same.

  // Get oracle payload (price cell with its signatures)
  const oraclePayload = await sdk.getOracleData(baseAsset);

  // Now we have all the necessary params for packing increase position transaction:
  const res = sdk.increasePositionParams({
    // isPositionManagerInited is false only on first interaction with position manager. After, it remain always 'true'. Correct usage saves a small amount of Gas.
    initPositionManager: !staticData.isPositionManagerInited,
    jettonWalletAddress: staticData.jettonWalletAddress,

    assetId: staticData.asset.index,
    signaturesRef: oraclePayload.signaturesRef,
    priceRef: oraclePayload.priceRef,

    traderAddress: traderAddress,

    amount: toStablecoin(100),

    leverage: numToNano(2),

    minBaseAssetAmount: numToNano(0),

    direction: Direction.short,

    stopTriggerPrice: numToNano(1),

    takeTriggerPrice: numToNano(2),

    referralId: 0,
  });

  // TX's address
  console.log(res.to);
  // TX's message body
  console.log(res.body);
  // TX's message value
  console.log(res.value);
}

main();
