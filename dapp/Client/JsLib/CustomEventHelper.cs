using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dapp.Client.JsLib
{
    public class ConnectedHelper
    {
        private readonly Func<EventArgs, Task> _callback;

        public ConnectedHelper(Func<EventArgs, Task> callback)
        {
            _callback = callback;
        }

        [JSInvokable]
        public Task OnConnected(EventArgs args) => _callback(args);
    }

    public class ConnectedInterop : IDisposable
    {
        private readonly IJSRuntime _jsRuntime;
        private DotNetObjectReference<ConnectedHelper> Reference;
        private IJSObjectReference _walletAdapter;
        public ConnectedInterop(IJSRuntime jsRuntime)
        {
            _jsRuntime = jsRuntime;
        }

        public async ValueTask<string> SetupConnectedCallback(Func<EventArgs, Task> callback)
        {
            //NOT SURE IF THIS REFERENCE THING IS DOING ANYTHING, MAYBE I NEED TO USE THE MICROSOFT JSINTEROP.TS TO REF THE DOTNETOBJECTREFERENCE?
            Reference = DotNetObjectReference.Create(new ConnectedHelper(callback));
            // addConnectedListener will be a js function we create later
            //return _jsRuntime.InvokeAsync<string>("WalletAdapterClass.addConnectedEvent", Reference);
            string _func = "getWalletAdapterClass";
            _walletAdapter = await _jsRuntime.InvokeAsync<IJSObjectReference>($"jsinterop.{_func}", "./jsinterop.js",Reference);
            return await _walletAdapter.InvokeAsync<string>("addEventListener");
        }

        public void Dispose()
        {
            Reference?.Dispose();
        }
    }
}
