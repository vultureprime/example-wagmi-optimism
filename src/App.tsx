import { optimism, optimismGoerli } from '@wagmi/core/chains'
import { publicProvider } from '@wagmi/core/providers/public'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import './App.css'
import SwitchChain from './components/CheckChain'
import ConnectWallet from './components/ConnectWallet'
import ViewNFT from './components/ViewNFT'

export const suportChains = [optimism, optimismGoerli]

const { chains, publicClient, webSocketPublicClient } = configureChains(
  suportChains,
  [publicProvider()]
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MetaMaskConnector({
      chains,
    }),
  ],
})

function App() {
  return (
    <WagmiConfig config={config}>
      <div className='header'>
        <ConnectWallet />
        <SwitchChain />
      </div>
      <ViewNFT />
    </WagmiConfig>
  )
}

export default App
