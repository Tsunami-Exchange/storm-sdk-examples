# Storm Trade SDK Examples

```sh
npm install @ton/core @ton/crypto @ton/ton @storm-trade/sdk
```

Using Yarn:

```sh
yarn add @ton/core @ton/crypto @ton/ton @storm-trade/sdk
```

## Examples

Check out the following examples in the project examples folder:

1. `increase-position.ts`: Init sdk and prepare an increase (open) position tx.

```sh
npm run increase-position
```

2. `close-position.ts`: Init sdk, fetch actual position data and prepare a close position tx.

```sh
npm run close-position
```

3. `create-limit-order.ts`: Set up SDK and prepare a limit or stop-limit order for sending to the blockchain.

```sh
npm run create-limit-order
```

4. `sync-methods.ts`: More performant sdk usage with a synchronous tx preparation.

```sh
npm run sync-methods
```

5. `market.ts`: Fetching an actual market's data, funding, prices.

```sh
npm run market
```

6. `position-manager.ts`: Getting trader's position data: long/short positions, orders, pnl, marginRatio etc.

```sh
npm run position-manager
```

7. `send-with-mnemonic.ts`: Prepare increase position tx, set up sdk and wallet with mnemonic, sing and send tx to the blockchain.

```sh
npm run send-with-mnemonic
```

8. `ton-connect.ts`: Prepare increase position tx, and send tx to the blockchain via TON Connect.

```sh
npm run ton-connect
```
