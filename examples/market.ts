/**
 * # Market
 *
 * Below is an example of how to use the Storm SDK to retrieve data related to the mainnet jUSDT Vault's markets data.
 * The code first initializes a TonClient instance, which is used to connect to the TON network and perform various operations on the blockchain. The code then retrieves a list of all assets available on the TON market, using the getAssets() method of the StormSDK library.
 * The code also retrieves a list of all markets available on the TON network, using the getMarkets() method of the StormSDK library. The code then selects a specific market based on the base asset (e.g., "TON") and uses the getIndexPrice(), getFunding(), and getExchangeSettings() methods to retrieve various data related to that market, such as the index price, funding rates, and exchange settings.
 * The code also obtains a more detailed Market instance using the getMarket() method of the StormSDK library, which allows for more fine-grained control over market operations. The code then uses the getAmmState() method to retrieve the current state of the Automated Market Maker (AMM) algorithm used in the market, as well as other dynamic parameters related to the market's operation.
 */

import { TonClient, TonClient4 } from "@ton/ton";
import { getHttpEndpoint, getHttpV4Endpoint } from "@orbs-network/ton-access";

import { StormSDK } from "@storm-trade/sdk";

async function main() {
  // Init http-v2 TON api (TON Access in this case)
  const client = new TonClient({ endpoint: await getHttpEndpoint() });

  // Or http-v4 api. You can use any of them.
  const client4 = new TonClient4({ endpoint: await getHttpV4Endpoint() });

  // Init mainnet jUSDT SDK with ton client:
  const sdk = StormSDK.asMainnetJUSDT(client);

  // Get full assets list
  const assetsList = await sdk.getAssets();
  console.log("assetsList", assetsList);

  // Get markets for a given vault
  const marketList = await sdk.getMarkets();
  console.log("marketList", marketList);

  // Base asset for a market
  const baseAsset = "TON";

  // Index price for a given base asset
  const indexPrice = await sdk.getIndexPrice(baseAsset);
  console.log("indexPrice", indexPrice);

  // Current market price for a given base asset at a choosen Vault
  const marketPrice = await sdk.getMarketPrice(baseAsset);
  console.log("marketPrice", marketPrice);

  // Get funding rates for a given base asset at a choosen Vault. Rates in 9 decimals
  const funding = await sdk.getFunding(baseAsset);
  console.log("long funding rate:", funding.longFunding);
  console.log("short funding rate:", funding.shortFunding);

  // Obtain market instance for a more detailed info:
  const market = await sdk.getMarket(baseAsset);

  // Get market's exchange settings.
  // See types comments for more info
  const exchangeSettings = await market.getExchangeSettings();
  console.log("exchangeSettings", exchangeSettings);

  // Amm state. Dynamic params.
  // See types comments for more info
  const ammState = await market.getAmmState();
  console.log("ammState", ammState);
}

main();
