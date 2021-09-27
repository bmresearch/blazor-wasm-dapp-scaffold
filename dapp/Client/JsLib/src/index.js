var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseWalletAdapter } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolletWalletAdapter } from '@solana/wallet-adapter-sollet';
import { SolongWalletAdapter } from '@solana/wallet-adapter-solong';
import { Message, Transaction } from "@solana/web3.js";
export function getWalletAdapterClass(name) {
    var k = new WalletAdapterClass(name);
    return k;
}
function ToBase64(u8) {
    return btoa(String.fromCharCode.apply(null, u8));
}
class WalletAdapterClass {
    constructor(name) {
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
    signTransaction(message) {
        return __awaiter(this, void 0, void 0, function* () {
            var msg1 = Message.from(Uint8Array.from(atob(message), c => c.charCodeAt(0)));
            var tx = Transaction.populate(msg1, [this.adapter.publicKey.toString()]);
            tx.compileMessage();
            return ToBase64(yield (yield this.adapter.signTransaction(tx)).serialize());
        });
    }
    signMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasSignMessage) {
                return ToBase64(yield this.adapter.signMessage(Uint8Array.from(atob(message), c => c.charCodeAt(0))));
            }
        });
    }
    ConnectedHandler() {
        return __awaiter(this, void 0, void 0, function* () {
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