// Send with mnemonic

// This example code demonstrates an example of using a mnemonic phrase to send an increase position transaction on the Ton blockchain via our SDK (StormSDK). Here's a brief overview of what this script does:

import { internal } from "@ton/core";
import { TonClient, TonClient4, WalletContractV4 } from "@ton/ton";
import { getHttpEndpoint, getHttpV4Endpoint } from "@orbs-network/ton-access";
import { mnemonicToPrivateKey } from "@ton/crypto";

import { StormSDK, Direction, numToNano, toStablecoin } from "@storm-trade/sdk";

async function main() {
  // Init http-v2 TON api (TON Access in this case)
  const client = new TonClient({ endpoint: await getHttpEndpoint() });
  // Or http-v4 api. You can use any of them.
  const client4 = new TonClient4({ endpoint: await getHttpV4Endpoint() });

  const mnemonic = "your wallet mnemonic...";
  const keypair = await mnemonicToPrivateKey(mnemonic.split(" "));

  const wallet = client4.open(
    // V4 here means version of your wallet smart contract. It can be V3R2 (WalletContractV3R2), the second most popular wallet's contract.
    WalletContractV4.create({ workchain: 0, publicKey: keypair.publicKey })
  );

  // Init mainnet jUSDT SDK with ton client:
  const sdk = StormSDK.asMainnetJUSDT(client4);

  // Getting increase position params
  const res = await sdk.increasePosition({
    amount: toStablecoin(100),
    traderAddress: wallet.address,
    leverage: numToNano(2),
    baseAsset: "TON",
    direction: Direction.short,
    stopTriggerPrice: numToNano(2),
    takeTriggerPrice: numToNano(3),
  });

  //  Now send TX via opened wallet:
  await wallet.sendTransfer({
    seqno: await wallet.getSeqno(),
    secretKey: keypair.secretKey,
    messages: [
      internal({
        to: res.to,
        value: res.value,
        body: res.body,
      }),
    ],
  });
}

main();
