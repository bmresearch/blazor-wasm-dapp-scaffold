# 🏗 Solana App Scaffold
Scaffolding for a dApp built on Solana using Blazor WebAssembly and Solnet + solana-web3.js interoperability

## Quickstart

```bash
git clone https://github.com/bmresearch/blazor-wasm-dapp-scaffold.git

cd blazor-wasm-dapp-scaffold
```

## Environment

1. Install net5
2. Install npm

Before being able to run the project you will need to go inside the `src/Client/JsLib` folder and do the following:

```bash
npm install

npm run build
```

## Overview

This project currently features a bare bones skeleton to easily bootstrap dApps for Solana built using Blazor Wasm.

The list of adapters that were targeted with this:
- [Phantom](https://github.com/solana-labs/wallet-adapter/tree/master/packages/phantom)
- [Sollet](https://github.com/solana-labs/wallet-adapter/tree/master/packages/sollet)
- [Sollet Extension](https://github.com/solana-labs/wallet-adapter/tree/master/packages/sollet)
- [Solflare](https://github.com/solana-labs/wallet-adapter/tree/master/packages/solflare)
- [Solflare Web](https://github.com/solana-labs/wallet-adapter/tree/master/packages/sollet)
- [Solong](https://github.com/solana-labs/wallet-adapter/tree/master/packages/solong)


It is currently able to (with much hacking around and probably a lot of errors/exceptions being thrown):
- request a connection from the wallet adapter
- fetch the address of the wallet selected in the wallet adapter
- request the wallet adapter to sign a transaction

What should be done:
- writing a class in the `src/Client/JsLib` which abstracts the Wallet Adapters instead of using them directly and 
which allows us to plug in an event from C# which has a property with the `JSInvokable` attribute so it can be directly invoked from the JS
- in the class mentioned previously some QoL abstractions should be made in order to make it easier to do the JS Interop calls, 
out of the adapters mentioned previously only the Phantom one has `signMessage(message: Uint8Array)`, and the others have `signTransaction(transaction: Transaction)`
which is the solana-web3.js `Transaction` object, some compromise should be done in order to make this easier:
  - only do one `InvokeAsync<byte[]>("signMessage")` where you pass the compiled message from the Solnet `TransactionBuilder` and it could check
  if the adapter has `signMessage` or if it needs to deserialize the compiled message into a transaction object before calling `signTransaction`

