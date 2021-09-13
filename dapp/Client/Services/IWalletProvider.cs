using Microsoft.JSInterop;
using System;
using System.Threading.Tasks;
using Solnet.Wallet;

namespace dapp.Client.Services
{
    interface IWalletProvider
    {
        /// <summary>
        /// Loads the given wallet provider using the given JS runtime.
        /// </summary>
        /// <param name="jsRuntime">The JS runtime instance.</param>
        /// <returns>An asynchronous task.</returns>
        public Task Load(IJSRuntime jsRuntime);

        /// <summary>
        /// Disconnects from the given wallet provider.
        /// </summary>
        /// <returns>An asynchronous task.</returns>
        public Task Disconnect();

        /// <summary>
        /// Connects to the given wallet provider.
        /// </summary>
        /// <returns>An asynchronous task.</returns>
        public Task Connect();

        /// <summary>
        /// Requests the wallet provider a signature of the given compiled solana message, necessary to submit a transaction to cluster.
        /// </summary>
        /// <param name="compiiledMessage">The compiled solana message to sign.</param>
        /// <returns>The signature of this compiled message corresponding transaction.</returns>
        public Task<byte[]> SignTransaction(byte[] compiiledMessage);

        /// <summary>
        /// Requests the wallet provider a signature of the given message.
        /// </summary>
        /// <param name="message">The message to sign.</param>
        /// <returns>The signature of the message</returns>
        public Task<byte[]> SignMessage(byte[] message);

        /// <summary>
        /// 
        /// </summary>
        public event Action OnConnected;

        /// <summary>
        /// 
        /// </summary>
        public event Action OnDisconnected;

        /// <summary>
        /// 
        /// </summary>
        public event Action OnError;
        
        /// <summary>
        /// The wallet's public key.
        /// </summary>
        public PublicKey PublicKey { get; }

        /// <summary>
        /// The provider's name.
        /// </summary>
        public string Name { get; }

        /// <summary>
        /// The provider's website.
        /// </summary>
        public string Url { get; }

        /// <summary>
        /// A link to the provider's icon..
        /// </summary>
        public string IconUrl { get; }
    }
}
