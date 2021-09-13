using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using Blazored.Modal;
using dapp.Client.Services;
using Solnet.Rpc;

namespace dapp.Client
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebAssemblyHostBuilder.CreateDefault(args);
            builder.RootComponents.Add<App>("#app");
            
            builder.Services.AddBlazoredModal();
            
            builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
            builder.Services.AddSingleton<IWalletService, WalletService>();
            builder.Services.AddSingleton(s => new AppState());
            
            await builder.Build().RunAsync();
        }
    }
}
