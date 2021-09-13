using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.JSInterop;
using Solnet.Wallet;

namespace dapp.Client.Services
{
    public class WalletService : IWalletService
    {
        public WalletService() { }

        public void SetProvider(WalletProvider provider)
        {
            SelectedProvider = provider;
            OnConnected?.Invoke();
        }

        public async Task<byte[]> SignMessage(byte[] message)
        {
            if (SelectedProvider != null) return await SelectedProvider.SignMessage(message);
            Console.WriteLine("No provider selected");
            return null;
        }

        public async Task<byte[]> SignTransaction(byte[] compiledMessage)
        {
            if (SelectedProvider != null) return await SelectedProvider.SignTransaction(compiledMessage);
            Console.WriteLine("No provider selected");
            return null;
        }

        public PublicKey PublicKey => SelectedProvider.PublicKey;
        public List<WalletProvider> WalletProviders => WalletAdapters.Adapters;
        public WalletProvider SelectedProvider { get; set; }
        
        public event Action OnConnected;
    }
}
