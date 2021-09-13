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
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { SolletWalletAdapter } from '@solana/wallet-adapter-sollet';
import { SolongWalletAdapter } from '@solana/wallet-adapter-solong';
import { getCurrentTime } from './time';
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
//# sourceMappingURL=index.js.map