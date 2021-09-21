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
            Console.WriteLine("Event handled");
            var publicKey = await GetWalletPublicKey();
            if (publicKey == null)
            {
                Console.WriteLine($"publicKey object ref is null");
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

            //Console.WriteLine($"Calling {_funcName} to get adapter");
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
        //ONly Phantom exposes this
        public async Task<byte[]> SignMessage(byte[] message)
        {
            if (_wallet == null)
            {
                Console.WriteLine("wallet adapter is null");
                return null;
            }
            Console.WriteLine("pre-sign");
            var signature = await _wallet.InvokeAsync<byte[]>("sign", message);
            Console.WriteLine("message has been signed");
            Console.WriteLine("signature = " + signature);
            return signature;
        }

        public async Task<byte[]> SignTransaction(byte[] compiledMessage)
        {
            if (_wallet == null)
            {
                Console.WriteLine("wallet adapter is null");
                return null;
            }
            Console.WriteLine("pre-sign");
            var signature = await _wallet.InvokeAsync<byte[]>("sign", compiledMessage);
            Console.WriteLine("tx has been signed");
            Console.WriteLine("signature = " + signature);
            return signature;
        }

        //public async Task<byte[]> SignTransaction(byte[] compiledMessage)
        //{
        //    if (_adapter == null)
        //    {
        //        Console.WriteLine("wallet adapter is null");
        //        return null;
        //    }

        //    var txObject = await _jsRuntime.InvokeAsync<IJSObjectReference>("signTransaction", _wallet, compiledMessage);
        //    Console.WriteLine("transaction has been signed");
        //    if (txObject != null) return await txObject.InvokeAsync<byte[]>("serialize");

        //    Console.WriteLine("transaction object is null");
        //    return null;
        //}

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
