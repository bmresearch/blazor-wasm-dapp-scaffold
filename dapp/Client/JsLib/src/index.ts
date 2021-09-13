import { MessageSignerWalletAdapter, SignerWalletAdapter, WalletAdapter } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, PhantomWalletAdapterConfig } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter, SolflareWalletAdapterConfig } from '@solana/wallet-adapter-solflare';
import { SolletWalletAdapter, SolletWalletAdapterConfig } from '@solana/wallet-adapter-sollet';
import { SolongWalletAdapter, SolongWalletAdapterConfig } from '@solana/wallet-adapter-solong';
import { getCurrentTime } from './time';
import { Transaction } from "@solana/web3.js";

export function GetCurrentTime() {
    return getCurrentTime();
}

export interface Wallet {
    adapter: () => WalletAdapter | SignerWalletAdapter | MessageSignerWalletAdapter;
}

export const GetPhantomWallet = (config: PhantomWalletAdapterConfig = {}): Wallet => ({
    adapter: () => new PhantomWalletAdapter(config),
});

export const GetSolflareWallet = (config: SolflareWalletAdapterConfig = {}): Wallet => ({
    adapter: () => new SolflareWalletAdapter(config),
});

export const GetSolflareWebWallet = ({ provider, ...config }: SolletWalletAdapterConfig = {}): Wallet => ({
    adapter: () => new SolletWalletAdapter({ provider: 'https://solflare.com/access-wallet', ...config }),
});

export const GetSolletWallet = ({ provider, ...config }: SolletWalletAdapterConfig = {}): Wallet => ({
    adapter: () => new SolletWalletAdapter({ provider: 'https://www.sollet.io', ...config }),
});

export const GetSolletExtensionWallet = ({ provider, ...config }: SolletWalletAdapterConfig = {}): Wallet => ({
    adapter: () => new SolletWalletAdapter(config),
});

export const GetSolongWallet = (config : SolongWalletAdapterConfig = {}): Wallet => ({
    adapter: () => new SolongWalletAdapter(config),
});