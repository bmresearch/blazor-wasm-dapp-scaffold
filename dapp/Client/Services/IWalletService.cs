using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.JSInterop;
using Solnet.Wallet;

namespace dapp.Client.Services
{
    interface IWalletService
    {
        PublicKey PublicKey { get; }

        List<WalletProvider> WalletProviders { get; }

        WalletProvider SelectedProvider { get; set; }
        
        void SetProvider(WalletProvider provider);

        Task<byte[]> SignMessage(byte[] compiledMessage);

        Task<byte[]> SignTransaction(byte[] compiledMessage);
        
        public event Action OnConnected;
    }
}
