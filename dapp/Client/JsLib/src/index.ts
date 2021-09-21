import { BaseSignerWalletAdapter, BaseWalletAdapter, EventEmitter, MessageSignerWalletAdapter, SendTransactionOptions, SignerWalletAdapter, WalletAdapter, WalletAdapterEvents } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, PhantomWalletAdapterConfig } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter, SolflareWalletAdapterConfig } from '@solana/wallet-adapter-solflare';
import { SolletWalletAdapter, SolletWalletAdapterConfig } from '@solana/wallet-adapter-sollet';
import { SolongWalletAdapter, SolongWalletAdapterConfig } from '@solana/wallet-adapter-solong';
import { getCurrentTime } from './time';
import { Connection, Message, PublicKey, Transaction, TransactionInstruction, AccountMeta } from "@solana/web3.js";
import { Buffer } from 'buffer';

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
export function getWalletAdapterClass(name): WalletAdapterClass {
    var k = new WalletAdapterClass(name);
    return k;
}
function ToBase64(u8) {
    return btoa(String.fromCharCode.apply(null, u8));
}

function FromBase64 (str) {
    return atob(str).split('').map(function (c) { return c.charCodeAt(0); });
}
function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
declare class Adapter extends BaseWalletAdapter {
    publicKey: PublicKey;
    ready: boolean;
    connecting: boolean;
    connected: boolean;
    autoApprove: boolean;
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
        //super();
        this.name = name;
        switch (this.name) {
            case "Phantom":
                this.adapter = new PhantomWalletAdapter();
                this.hasSignMessage = true;
                break;
            case "Solflare":
                this.adapter = new SolletWalletAdapter({ provider: 'https://solflare.com/access-wallet' });
                this.hasSignMessage = false;
                break;
            case "SolflareWeb":
                this.adapter = new SolletWalletAdapter({ provider: 'https://solflare.com/access-wallet' });
                this.hasSignMessage = false;
                break;
            case "Sollet":
                this.adapter = new SolletWalletAdapter({ provider: 'https://www.sollet.io' });
                this.hasSignMessage = false;
                break;
            case "SolletExtension":
                this.adapter = new SolletWalletAdapter();
                this.hasSignMessage = false;
                break;
            case "Solong":
                this.adapter = new SolongWalletAdapter();
                this.hasSignMessage = false;
                break;
            default:
                break;
        }
        window.console.log("constructor fired with " + name + " wallet");
    }
    GetAdapter() {
        return this.adapter;
    }

    async sign(message) {
        window.console.log("sign method fired");

        window.console.log("message=" + message);
        var msg1 = Message.from(Uint8Array.from(atob(message), c => c.charCodeAt(0)));
        var tx = Transaction.populate(msg1, [this.adapter.publicKey.toString()]);
       
        tx.compileMessage();
        return ToBase64(await (await (this.adapter as SignerWalletAdapter).signTransaction(tx)).serialize());

        //tx.setSigners(this.adapter.publicKey);
        //window.console.log("message.from = " + msg1);
        //var newTx = new Transaction();
        //newTx.recentBlockhash = this.adapter.publicKey.toBase58();
        //newTx.feePayer = this.adapter.publicKey;
        //var aM: Array<AccountMeta> = [{ pubkey: this.adapter.publicKey, isSigner: true, isWritable: true }]
        //var buffer1: Buffer = new Buffer("Hello Solnet x solana-web3.js from Blazor Wasm", 'base64');
        //tx.add(new TransactionInstruction({ data: buffer1, keys: aM, programId: this.adapter.publicKey }));

        //THIS IS IF YOU WANTED TO USE PHANTOMS SIGN MESSSAGE, WHICH POPULATES THE MEMO TEXT IN THE WALLET WHEN SIGNING THE TX
        //if (this.hasSignMessage) {
        //    window.console.log("message=" + message);
        //    //var tx = Transaction.from(Uint8Array.from(atob(message), c => c.charCodeAt(0)));
        //    //var txm = tx.serializeMessage();
        //    //var f = ToBase64(await (this.adapter as MessageSignerWalletAdapter).signMessage(txm));
        //    //or...
        //    var msg = Uint8Array.from(atob(message), c => c.charCodeAt(0));
        //    return ToBase64(await (this.adapter as MessageSignerWalletAdapter).signMessage(msg));
        //    //return (this.adapter as MessageSignerWalletAdapter).signMessage(message);
        //}
        //else {
        // window.console.log("2");
        //window.console.log("message=" + message);
        //var msg1 = Message.from(Uint8Array.from(atob(message), c => c.charCodeAt(0)));
        //var tx = Transaction.populate(msg1, [this.adapter.publicKey.toString()]);
        ////tx.setSigners(this.adapter.publicKey);
        ////window.console.log("message.from = " + msg1);
        ////var newTx = new Transaction();
        ////newTx.recentBlockhash = this.adapter.publicKey.toBase58();
        ////newTx.feePayer = this.adapter.publicKey;
        ////var buffer1:Buffer = Buffer.from("Hello Solnet x solana-web3.js from Blazor Wasm", 'base64');
        ////tx.add(new TransactionInstruction({ data: buffer1, keys: [], programId: this.adapter.publicKey }));
        //tx.compileMessage();
        ////nn.sign();
        //return ToBase64(await (await (this.adapter as SignerWalletAdapter).signTransaction(tx)).serialize());
        //}
        //else {
        //    window.console.log("2");
        //    window.console.log("message=" + message);
        //    window.console.log("messageds=" + Uint8Array.from(atob(message), c => c.charCodeAt(0)));
        //    var msgtx = Transaction.from(Uint8Array.from(atob(message), c => c.charCodeAt(0)));

        //    window.console.log("msgtxs=" + msgtx.serializeMessage());
        //    var k = await (this.adapter as SignerWalletAdapter).signTransaction(msgtx);
        //    return k;
        //}
    }
    public async ConnectedHandler() {
        window.console.log("connected handler fired");
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