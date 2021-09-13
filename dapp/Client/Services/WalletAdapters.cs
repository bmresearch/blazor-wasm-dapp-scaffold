using System.Collections.Generic;

namespace dapp.Client.Services
{
    /// <summary>
    /// Represents the different wallet adapters. This is hacked like this because of js interop limitations on accessing properties.
    /// </summary>
    public static class WalletAdapters
    {
        /// <summary>
        /// The base url for the wallet adapter icons.
        /// </summary>
        private static readonly string IconsBaseUrl =
            "https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/icons";

        public static List<WalletProvider> Adapters = new List<WalletProvider>
        {
            new WalletProvider(
                "Phantom", "https://phantom.app", IconsBaseUrl + "/phantom.svg", "GetPhantomWallet"),
            new WalletProvider(
                "Solflare", "https://solflare.com", IconsBaseUrl + "/solflare.svg", "GetSolflareWallet"),
            new WalletProvider(
                "Solflare Web", "https://solflare.com", IconsBaseUrl + "/solflare.svg", "GetSolflareWebWallet"),
            new WalletProvider(
                "Sollet", "https://sollet.io", IconsBaseUrl + "/sollet.svg", "GetSolletWallet"),
            new WalletProvider(
                "Sollet Extension", "https://chrome.google.com/webstore/detail/sollet/fhmfendgdocmcbmfikdcogofphimnkno",
                IconsBaseUrl + "/sollet_extension.png", "GetSolletExtensionWallet"),
            new WalletProvider(
                "Solong", "https://solongwallet.com", IconsBaseUrl + "/solong.png", "GetSolflareWallet"),
        };
    }
}