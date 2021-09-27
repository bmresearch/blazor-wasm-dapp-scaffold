import { BaseSignerWalletAdapter, BaseWalletAdapter, EventEmitter, MessageSignerWalletAdapter, SendTransactionOptions, SignerWalletAdapter, WalletAdapter, WalletAdapterEvents } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, PhantomWalletAdapterConfig } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter, SolflareWalletAdapterConfig } from '@solana/wallet-adapter-solflare';
import { SolletWalletAdapter, SolletWalletAdapterConfig } from '@solana/wallet-adapter-sollet';
import { SolongWalletAdapter, SolongWalletAdapterConfig } from '@solana/wallet-adapter-solong';
import { Connection, Message, PublicKey, Transaction, TransactionInstruction, AccountMeta } from "@solana/web3.js";

export function getWalletAdapterClass(name): WalletAdapterClass {
    var k = new WalletAdapterClass(name);
    return k;
}
function ToBase64(u8) {
    return btoa(String.fromCharCode.apply(null, u8));
}
declare class Adapter extends BaseWalletAdapter {
    publicKey: PublicKey;
    ready: boolean;
    connecting: boolean;
    connected: boolean;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    sendTransaction(transaction: Transaction, connection: Connection, options?: SendTransactionOptions): Promise<string>;    
}
class WalletAdapterClass {
    adapter:Adapter;
    private instance?: DotNet.DotNetObject;
    private name;
    private hasSignMessage:boolean;
    public constructor(name){
        this.name = name;
        switch (this.name) {
            case "Phantom":
                this.adapter = new PhantomWalletAdapter();
                this.hasSignMessage = true;
                break;
            case "Solflare":
                this.adapter = new SolletWalletAdapter({ provider: 'https://solflare.com/access-wallet' });
                this.hasSignMessage = true;
                break;
            case "SolflareWeb":
                this.adapter = new SolletWalletAdapter({ provider: 'https://solflare.com/access-wallet' });
                this.hasSignMessage = true;
                break;
            case "Sollet":
                this.adapter = new SolletWalletAdapter({ provider: 'https://www.sollet.io' });
                this.hasSignMessage = true;
                break;
            case "Sollet Extension":
                this.adapter = new SolletWalletAdapter({ provider: 'https://www.sollet.io' });
                this.hasSignMessage = true;
                break;
            case "Solong":
                this.adapter = new SolongWalletAdapter();
                this.hasSignMessage = false;
                break;
            default:
                break;
        }
    }
    GetAdapter() {
        return this.adapter;
    }

    async signTransaction(message) {
        var msg1 = Message.from(Uint8Array.from(atob(message), c => c.charCodeAt(0)));
        var tx = Transaction.populate(msg1, [this.adapter.publicKey.toString()]);       
        tx.compileMessage();
        return ToBase64(await (await (this.adapter as SignerWalletAdapter).signTransaction(tx)).serialize());
    }
    async signMessage(message) {
        if (this.hasSignMessage) {            
            return ToBase64(await (this.adapter as MessageSignerWalletAdapter).signMessage(Uint8Array.from(atob(message), c => c.charCodeAt(0))));
        }        
    }
    public async ConnectedHandler() {
        var argstopass = new Object();
        await this.instance.invokeMethodAsync("OnEvent", argstopass);
    };
    public removeEventListener() {
        this.adapter.removeListener('connect');
    }
    addEventListener(instance: DotNet.DotNetObject) {
        this.removeEventListener();
        this.instance = instance;
        this.adapter.on('connect', () => this.ConnectedHandler());
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