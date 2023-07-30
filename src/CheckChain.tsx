import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { suportChains } from './App'

export default function SwitchChain() {
  const { chain } = useNetwork()
  const { address } = useAccount()
  const { error, isLoading, pendingChainId, switchNetworkAsync } =
    useSwitchNetwork()
  const isNotSupport = !(
    chain &&
    suportChains &&
    suportChains?.map((x) => x.id as number).includes(chain.id)
  )
  if (!address) {
    return null
  }
  return (
    <div>
      {isNotSupport
        ? 'Please Switch network'
        : chain && <div>Connected to {chain.name}</div>}

      {suportChains.map((x) => (
        <button
          disabled={
            !switchNetworkAsync ||
            x.id === chain?.id ||
            (pendingChainId === x.id && isLoading)
          }
          key={x.id}
          onClick={() => switchNetworkAsync?.(x.id)}
        >
          {x.name}
        </button>
      ))}

      <div>{error && error.message}</div>
    </div>
  )
}
