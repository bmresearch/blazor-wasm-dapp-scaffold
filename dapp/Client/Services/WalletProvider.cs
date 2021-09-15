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
        private IJSObjectReference _walletClass;
        private IJSObjectReference _adapter;
        private string _walletPublicKey;
        private readonly string _url;
        private readonly string _iconUrl;
        private readonly string _name;
        private readonly string _funcName;
        private CancellationTokenSource _cts;
        private bool _connected;
        private PublicKey _publicKey;

        public WalletProvider(string name, string url, string iconUrl, string functionName) 
        {
            _name = name;
            _url = url;
            _iconUrl = iconUrl;
            _funcName = functionName;
            _cts = new CancellationTokenSource();
        }
        
        public async Task Load(IJSRuntime jsRuntime)
        {
            if (jsRuntime == null)
            {
                Console.WriteLine("JS Runtime is null");
                return;
            }
            _jsRuntime = jsRuntime;
            
            Console.WriteLine($"Calling {_funcName} to get adapter");
            string _func = "getWalletAdapterClass";
            _walletClass = await _jsRuntime.InvokeAsync<IJSObjectReference>($"jsinterop.{_func}", "./jsinterop.js");
            Console.WriteLine($"Attempting to start {_name} wallet");
            _wallet = await _walletClass.InvokeAsync<IJSObjectReference>("GetWallet");
            if (_wallet == null)
            {
                Console.WriteLine("wallet is null");
                return;
            }
            _adapter = await _wallet.InvokeAsync<IJSObjectReference>("adapter");
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
            //await Task.Run(() => CheckConnection(_cts.Token));
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
            if (_adapter == null)
            {
                Console.WriteLine("wallet adapter is null");
                return null;
            }
            
            var signature = await _adapter.InvokeAsync<byte[]>("signMessage", message);
            Console.WriteLine("message has been signed");
            return signature;
        }

        public async Task<byte[]> SignTransaction(byte[] compiledMessage)
        {
            if (_adapter == null)
            {
                Console.WriteLine("wallet adapter is null");
                return null;
            }
            
            var txObject = await _jsRuntime.InvokeAsync<IJSObjectReference>("signTransaction", _wallet, compiledMessage);
            Console.WriteLine("transaction has been signed");
            if (txObject != null) return await txObject.InvokeAsync<byte[]>("serialize");
            
            Console.WriteLine("transaction object is null");
            return null;
        }

        private async Task CheckConnection(CancellationToken ct)
        {
            while (!ct.IsCancellationRequested)
            {
                Console.WriteLine($"Checking connection");
                var publicKey = await GetWalletPublicKey();
                if (publicKey == null)
                {
                    Console.WriteLine($"publicKey object ref is null");
                    await Task.Delay(100, ct);
                    continue;
                }
                _publicKey = new PublicKey(publicKey);
                OnConnected?.Invoke();
                _cts.Cancel();
            }
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
