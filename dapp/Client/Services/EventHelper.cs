using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dapp.Client.Services
{
    public class EventHelper
    {
        private readonly Func<EventArgs, Task> _callback;
        public EventHelper(Func<EventArgs, Task> callback)
        {
            _callback = callback;
        }
        [JSInvokable]
        public Task OnEvent(EventArgs args) => _callback(args);
    }
    public class EventInterop : IDisposable
    {
        private readonly IJSRuntime _jsRuntime;
        private DotNetObjectReference<EventHelper> Reference;

        public EventInterop(IJSRuntime jsRuntime)
        {
            _jsRuntime = jsRuntime;
        }

        public async ValueTask<string> SetupEventCallback(Func<EventArgs, Task> callback, IJSObjectReference _walletAdapter)
        {
            Reference = DotNetObjectReference.Create(new EventHelper(callback));
            return await _walletAdapter.InvokeAsync<string>("addEventListener", Reference);
        }

        public void Dispose()
        {
            Reference?.Dispose();
        }
    }
}
