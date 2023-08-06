import { useEffect, useState } from 'react'
import Erc721ABI from '../assets/abi/erc721_full.json'
import { useChainId, useContractRead, useContractReads } from 'wagmi'
import axios from 'axios'
import { z } from 'zod'
import { isAddress } from 'ethers'

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
  contractAddress: zodAddress,
})
const useGetNFTCollection = (input?: z.input<typeof validator>) => {
  const result = validator.safeParse(input)
  const [data, setData] = useState<any[]>()
  const chainId = useChainId()
  const { data: totalNFT } = useContractRead(
    result.success
      ? {
          abi: Erc721ABI,
          address: result.data.contractAddress,
          args: [result.data.walletAddress],
          functionName: 'balanceOf',
          watch: true,
          enabled: !!result.data.contractAddress,
          chainId,
          select: (data) => data?.toString(),
        }
      : undefined
  )

  const newArray = totalNFT ? (Array(Number(totalNFT)).fill(0) as number[]) : []
  const calls =
    result.success && newArray.length > 0
      ? newArray.map((_, index) => ({
          abi: Erc721ABI,
          functionName: 'tokenOfOwnerByIndex',
          address: result.data.contractAddress,
          args: [result.data.walletAddress, index],
          chainId,
        }))
      : []

  const { data: tokenID } = useContractReads({
    contracts: calls,
    watch: true,
    enabled: newArray.length > 0 && result.success,
    select: (value) => {
      return value.map((value) => value?.result.toString())
    },
  })

  const callsTokenURI =
    result.success && tokenID
      ? tokenID?.map((tokenId) => ({
          abi: Erc721ABI,
          functionName: 'tokenURI',
          address: result.data.contractAddress,
          args: [tokenId],
          chainId,
        }))
      : []

  const { data: tokenURI } = useContractReads({
    contracts: callsTokenURI,
    watch: true,
    enabled: !!tokenID,
    select: (value) => {
      return value.map((value) =>
        value?.result.toString().replace('ipfs://', 'https://ipfs.io/ipfs/')
      )
    },
  })

  const fetchTokenURI = async (tokenURI: string[]) => {
    const metaData = await Promise.all(
      tokenURI.map(async (item) => {
        try {
          const { data } = await axios.get(item)

          return data
        } catch (error) {
          return ''
        }
      })
    )
    return metaData
  }

  useEffect(() => {
    if (tokenURI) {
      fetchTokenURI(tokenURI)
        .then((data) => {
          setData(data)
        })
        .catch(console.log)
    }
  }, [tokenURI])

  return {
    data: data,
  }
}

export default useGetNFTCollection
