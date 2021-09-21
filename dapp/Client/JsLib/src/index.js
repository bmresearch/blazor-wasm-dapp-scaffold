var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { BaseWalletAdapter } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { SolletWalletAdapter } from '@solana/wallet-adapter-sollet';
import { SolongWalletAdapter } from '@solana/wallet-adapter-solong';
import { getCurrentTime } from './time';
import { Message, Transaction } from "@solana/web3.js";
export function GetCurrentTime() {
    return getCurrentTime();
}
export const GetPhantomWallet = (config = {}) => ({
    adapter: () => new PhantomWalletAdapter(config),
});
export const GetSolflareWallet = (config = {}) => ({
    adapter: () => new SolflareWalletAdapter(config),
});
export const GetSolflareWebWallet = (_a = {}) => {
    var { provider } = _a, config = __rest(_a, ["provider"]);
    return ({
        adapter: () => new SolletWalletAdapter(Object.assign({ provider: 'https://solflare.com/access-wallet' }, config)),
    });
};
export const GetSolletWallet = (_a = {}) => {
    var { provider } = _a, config = __rest(_a, ["provider"]);
    return ({
        adapter: () => new SolletWalletAdapter(Object.assign({ provider: 'https://www.sollet.io' }, config)),
    });
};
export const GetSolletExtensionWallet = (_a = {}) => {
    var { provider } = _a, config = __rest(_a, ["provider"]);
    return ({
        adapter: () => new SolletWalletAdapter(config),
    });
};
export const GetSolongWallet = (config = {}) => ({
    adapter: () => new SolongWalletAdapter(config),
});
export function getWalletAdapterClass(name) {
    var k = new WalletAdapterClass(name);
    return k;
}
function ToBase64(u8) {
    return btoa(String.fromCharCode.apply(null, u8));
}
function FromBase64(str) {
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
class WalletAdapterClass {
    constructor(name) {
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
    sign(message) {
        return __awaiter(this, void 0, void 0, function* () {
            window.console.log("sign method fired");
            window.console.log("message=" + message);
            var msg1 = Message.from(Uint8Array.from(atob(message), c => c.charCodeAt(0)));
            var tx = Transaction.populate(msg1, [this.adapter.publicKey.toString()]);
            tx.compileMessage();
            return ToBase64(yield (yield this.adapter.signTransaction(tx)).serialize());
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
        });
    }
    ConnectedHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            window.console.log("connected handler fired");
            var argstopass = new Object();
            yield this.instance.invokeMethodAsync("OnEvent", argstopass);
        });
    }
    ;
    removeEventListener() {
        this.adapter.removeListener('connect');
    }
    addEventListener(instance) {
        this.removeEventListener();
        this.instance = instance;
        this.adapter.on('connect', () => this.ConnectedHandler());
    }
}
//# sourceMappingURL=index.js.map