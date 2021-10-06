using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.JSInterop;
using Solnet.Wallet;

namespace dapp.Client.Services
{
    public class WalletProvider : IWalletProvider
    {
        private IJSRuntime _jsRuntime;
        private IJSObjectReference _wallet;
        private IJSObjectReference _adapter;
        private string _walletPublicKey;
        private readonly string _url;
        private readonly string _iconUrl;
        private readonly string _name;
        private readonly string _funcName;
        private CancellationTokenSource _cts;
        private bool _connected;
        private PublicKey _publicKey;
        private EventInterop Interop { get; set; }

        public WalletProvider(string name, string url, string iconUrl, string functionName) 
        {
            _name = name;
            _url = url;
            _iconUrl = iconUrl;
            _funcName = functionName;
            _cts = new CancellationTokenSource();
        }
        private async Task HandleEvent(EventArgs args)
        {
            var publicKey = await GetWalletPublicKey();
            if (publicKey == null)
            {
                Console.WriteLine($"publicKey is null");
                return;
            }
            _publicKey = new PublicKey(publicKey);
            OnConnected?.Invoke();
            return;
        }
        public async Task Load(IJSRuntime jsRuntime)
        {
            if (jsRuntime == null)
            {
                Console.WriteLine("JS Runtime is null");
                return;
            }
            _jsRuntime = jsRuntime;
            string funcToExecute = "getWalletAdapterClass";
            _wallet = await _jsRuntime.InvokeAsync<IJSObjectReference>($"jsinterop.{funcToExecute}",_name, "./jsinterop.js");
            if (_wallet == null)
            {
                Console.WriteLine("wallet is null");
                return;
            }
            Interop = new EventInterop(jsRuntime);
            await Interop.SetupEventCallback(args => HandleEvent(args),_wallet);
            _adapter = await _wallet.InvokeAsync<IJSObjectReference>("GetAdapter");
            if (_adapter == null)
            {
                Console.WriteLine("wallet adapter is null");
                return;
            }
        }

        public async Task Connect()
        {
            if (_adapter == null)
            {
                Console.WriteLine("wallet adapter is null");
                return;
            }
            await _adapter.InvokeVoidAsync("connect");
        }

        public async Task Disconnect()
        {
            if (_adapter == null)
            {
                Console.WriteLine("wallet adapter is null");
                return;
            }
            await _adapter.InvokeVoidAsync("disconnect");
        }

        public async Task<byte[]> SignMessage(byte[] message)
        {
            if (_wallet == null)
            {
                Console.WriteLine("wallet adapter is null");
                return null;
            }
            var signature = await _wallet.InvokeAsync<byte[]>("signMessage", message);
            return signature;
        }

        public async Task<byte[]> SignTransaction(byte[] compiledMessage)
        {
            if (_wallet == null)
            {
                Console.WriteLine("wallet adapter is null");
                return null;
            }
            var signature = await _wallet.InvokeAsync<byte[]>("signTransaction", compiledMessage);
            return signature;
        }
        
        private async Task<string> GetWalletPublicKey()
        {
            var publicKey = await _adapter.InvokeAsync<string>("publicKey.toBase58");
            return publicKey;
        }

        public string Name => _name;
        public string Url => _url;
        public string IconUrl => _iconUrl;
        public PublicKey PublicKey => _publicKey;

        public event Action OnConnected;
        public event Action OnDisconnected;
        public event Action OnError;
    }
}
