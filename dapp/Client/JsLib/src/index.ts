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

export const getWalletAdapterClass = (): WalletAdapterClass => {
    return new WalletAdapterClass();
}
//Do I need to do the Microsoft jsinterop thing?
//make this class abstractify the wallet adapters, then ...
export class WalletAdapterClass implements Wallet {
    adapter: () => WalletAdapter | SignerWalletAdapter | MessageSignerWalletAdapter;
    private instance?: DotNet.DotNetObject;
    private name;
    public GetWallet(instance: DotNet.DotNetObject) {
        this.name = "Phantom";
        switch (this.name) {
            case "Phantom":
                (config: PhantomWalletAdapterConfig = {}): Wallet => ({
                    adapter: () => new PhantomWalletAdapter(config)
                })
                break;
            case "Solflare":
                (config: SolflareWalletAdapterConfig = {}): Wallet => ({
                    adapter: () => new SolflareWalletAdapter(config)
                })
                break;
            case "SolflareWeb":
                ({ provider, ...config }: SolletWalletAdapterConfig = {}): Wallet => ({
                    adapter: () => new SolletWalletAdapter({ provider: 'https://solflare.com/access-wallet', ...config }),
                })
                break;
            case "Sollet":
                ({ provider, ...config }: SolletWalletAdapterConfig = {}): Wallet => ({
                    adapter: () => new SolletWalletAdapter({ provider: 'https://www.sollet.io', ...config }),
                })
                break;
            case "SolletExtension":
                ({ provider, ...config }: SolletWalletAdapterConfig = {}): Wallet => ({
                    adapter: () => new SolletWalletAdapter(config),
                })
                break;
            case "Solong":
                (config: SolongWalletAdapterConfig = {}): Wallet => ({
                    adapter: () => new SolongWalletAdapter(config),
                })
                break;
            default:
                return;
        }
        
    }
    public ConnectedHandler() {
        this.instance.invokeMethod("OnConnected");
    };
    public removeEventListener() {
        window.removeEventListener("Connected",this.ConnectedHandler,false)
    }
    public addEventListener(instance: DotNet.DotNetObject) {
        this.removeEventListener();
        this.instance = instance;
        window.addEventListener("Connected", this.ConnectedHandler, false);
    }
}

declare module DotNet {
    /**
     * Invokes the specified .NET public method synchronously. Not all hosting scenarios support
     * synchronous invocation, so if possible use invokeMethodAsync instead.
     *
     * @param assemblyName The short name (without key/version or .dll extension) of the .NET assembly containing the method.
     * @param methodIdentifier The identifier of the method to invoke. The method must have a [JSInvokable] attribute specifying this identifier.
     * @param args Arguments to pass to the method, each of which must be JSON-serializable.
     * @returns The result of the operation.
     */
    function invokeMethod<T>(assemblyName: string, methodIdentifier: string, ...args: any[]): T;
    /**
     * Invokes the specified .NET public method asynchronously.
     *
     * @param assemblyName The short name (without key/version or .dll extension) of the .NET assembly containing the method.
     * @param methodIdentifier The identifier of the method to invoke. The method must have a [JSInvokable] attribute specifying this identifier.
     * @param args Arguments to pass to the method, each of which must be JSON-serializable.
     * @returns A promise representing the result of the operation.
     */
    function invokeMethodAsync<T>(assemblyName: string, methodIdentifier: string, ...args: any[]): Promise<T>;
    /**
     * Represents the .NET instance passed by reference to JavaScript.
     */
    interface DotNetObject {
        /**
        * Invokes the specified .NET instance public method synchronously. Not all hosting scenarios support
        * synchronous invocation, so if possible use invokeMethodAsync instead.
        *
        * @param methodIdentifier The identifier of the method to invoke. The method must have a [JSInvokable] attribute specifying this identifier.
        * @param args Arguments to pass to the method, each of which must be JSON-serializable.
        * @returns The result of the operation.
        */
        invokeMethod<T>(methodIdentifier: string, ...args: any[]): T;
        /**
         * Invokes the specified .NET instance public method asynchronously.
         *
         * @param methodIdentifier The identifier of the method to invoke. The method must have a [JSInvokable] attribute specifying this identifier.
         * @param args Arguments to pass to the method, each of which must be JSON-serializable.
         * @returns A promise representing the result of the operation.
         */
        invokeMethodAsync<T>(methodIdentifier: string, ...args: any[]): Promise<T>;
    }
}