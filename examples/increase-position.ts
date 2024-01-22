/**
 * # Increase position
 *
 * This code demonstrates how to use the StormSDK library to increase (open) trading positions on the jUSDT stablecoin pair on the TON blockchain. The script uses the TonClient and TonClient4 classes from the @ton/core package, which provide a low-level API for interacting with the TON blockchain.
 * The sdk.increasePosition method returns an object that contains everything needed for sending a TX to the blockchain, such as:
 *
 * - to: The address of the smart contract on the blockchain that will be called firstly to create the position.
 * - body: The message body that needs to be sent with the TX to the smart contract. This includes the parameters passed to the increasePosition method, such as the amount of margin, the trader's address, and the leverage to use for the position.
 * - value: The value of the transaction in nanoseconds.
 */

import { Address } from "@ton/core";
import { TonClient, TonClient4 } from "@ton/ton";
import { getHttpEndpoint, getHttpV4Endpoint } from "@orbs-network/ton-access";

import { StormSDK, Direction, numToNano } from "@storm-trade/sdk";

function toDecimals(src: number | string | bigint, decimals: number): bigint {
  if (decimals < 0) {
    throw new Error("Decimals value shoud be positive: " + decimals);
  }

  if (typeof src === "bigint") {
    return src * 10n ** BigInt(decimals);
  } else {
    if (typeof src === "number") {
      if (!Number.isFinite(src)) {
        throw Error("Invalid number");
      }

      if (Math.log10(src) <= 6) {
        src = src.toLocaleString("en", {
          minimumFractionDigits: decimals,
          useGrouping: false,
        });
      } else if (src - Math.trunc(src) === 0) {
        src = src.toLocaleString("en", {
          maximumFractionDigits: 0,
          useGrouping: false,
        });
      } else {
        throw Error(
          "Not enough precision for a number value. Use string value instead"
        );
      }
    }

    // Check sign
    let neg = false;
    while (src.startsWith("-")) {
      neg = !neg;
      src = src.slice(1);
    }

    // Split string
    if (src === ".") {
      throw Error("Invalid number");
    }
    let parts = src.split(".");
    if (parts.length > 2) {
      throw Error("Invalid number");
    }

    // Prepare parts
    let whole = parts[0];
    let frac = parts[1];
    if (!whole) {
      whole = "0";
    }
    if (!frac) {
      frac = "0";
    }
    if (frac.length > decimals) {
      throw Error("Invalid number");
    }
    while (frac.length < decimals) {
      frac += "0";
    }

    // Convert
    let r = BigInt(whole) * 10n ** BigInt(decimals) + BigInt(frac);
    if (neg) {
      r = -r;
    }
    return r;
  }
}

export function toStablecoin(value: number): bigint {
  return toDecimals(value.toString(), 6);
}

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
  const res = await sdk.increasePosition({
    // The amount of margin in stablecoins
    amount: toStablecoin(100),

    // The trader's address
    traderAddress: traderAddress,

    // The leverage to use for the position (in 9 decimals)
    leverage: numToNano(2),

    // The minimum base asset amount required for the position (optional)
    minBaseAssetAmount: numToNano(0),

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
