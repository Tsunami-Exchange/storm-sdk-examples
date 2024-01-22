/**
 * # Position manager
 *
 * Storm Trade protocol takes advantage of all the advantages of the TON blockchain to achieve high scalability and speed of transaction execution.
 * Therefore, the positions and orders of each user for each market are located in a separate smart contract (separate for each triple: Vault, Market, Trader).
 * This example shows how to read data, related to trader's data (positions, orders etc).
 */

import { Address } from "@ton/core";
import { TonClient, TonClient4 } from "@ton/ton";
import { getHttpEndpoint, getHttpV4Endpoint } from "@orbs-network/ton-access";
import { StormSDK } from "@storm-trade/sdk";

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

  // Case when there were not any trades for these Vault and Amm
  if (fullPositionData === null) {
    return;
  }

  // Addresses of <Vault, Amm>
  console.log(fullPositionData.vaultAddress);
  console.log(fullPositionData.vammAddress);

  // Map<number, OrderData>, Map of all traders limit orders for a given pair <Vault, Amm>.
  console.log(fullPositionData.limitOrders);

  // Long position for a given pair <Vault, Amm>. (if any)
  console.log(fullPositionData.longPosition);

  // Short position for a given pair <Vault, Amm>. (if any)
  console.log(fullPositionData.shortPosition);

  // Possible referral data for a given position account.
  console.log(fullPositionData.referralData);

  // Let's obtain more data about position such as pnl, funding etc.

  // Get exact Amm contract data:
  const market = await sdk.getMarket(baseAsset);

  // Get a last oracle price
  const price = await sdk.getIndexPrice(baseAsset);

  // Fetch the latest market long position data
  const marketPositionData = await market.getRemainMarginWithFundingPayment(
    price,
    fullPositionData.longPosition?.positionData!
  );

  console.log(marketPositionData.fundingPayment);
  console.log(marketPositionData.marginRatio);
  console.log(marketPositionData.unrealizedPnl);
  console.log(marketPositionData.badDebt);
}

main();
