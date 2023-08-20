import { isAddress } from 'ethers'
import { useChainId, useContractReads } from 'wagmi'
import { z } from 'zod'
import Erc20ABI from '../assets/abi/erc20.json'

export const zodAddress = z.custom<`0x${string}`>((value) => {
  if (typeof value !== 'string') {
    return false
  }
  if (!isAddress(value)) {
    return false
  }
  return true
})

const validator = z.object({
  walletAddress: zodAddress,
  contractAddress: zodAddress.array(),
})
const useTokenInfo = (input?: z.input<typeof validator>) => {
  const result = validator.safeParse(input)
  // const [data, setData] = useState<any[]>()
  const chainId = useChainId()
  const calls =
    result.success && result.data.contractAddress.length > 0
      ? result.data.contractAddress.map((address) => ({
          abi: Erc20ABI,
          functionName: 'name',
          address: address,
          args: [],
          chainId,
        }))
      : []

  const callsSymbol =
    result.success && result.data.contractAddress.length > 0
      ? result.data.contractAddress.map((address) => ({
          abi: Erc20ABI,
          functionName: 'symbol',
          address: address,
          args: [],
          chainId,
        }))
      : []

  const callsDecimals =
    result.success && result.data.contractAddress.length > 0
      ? result.data.contractAddress.map((address) => ({
          abi: Erc20ABI,
          functionName: 'decimals',
          address: address,
          args: [],
          chainId,
        }))
      : []

  const callsBalance =
    result.success && result.data.contractAddress.length > 0
      ? result.data.contractAddress.map((address) => ({
          abi: Erc20ABI,
          functionName: 'balanceOf',
          address: address,
          args: [result.data.walletAddress],
          chainId,
        }))
      : []

  const { data: names } = useContractReads({
    contracts: calls,
    watch: true,
    enabled: result.success,
  })
  const { data: symbols } = useContractReads({
    contracts: callsSymbol,
    watch: true,
    enabled: result.success,
  })
  const { data: decimals } = useContractReads({
    contracts: callsDecimals,
    watch: true,
    enabled: result.success,
  })
  const { data: balance } = useContractReads({
    contracts: callsBalance,
    watch: true,
    enabled: result.success,
  })

  return {
    names,
    symbols,
    decimals,
    balance,
  }
}

export default useTokenInfo
