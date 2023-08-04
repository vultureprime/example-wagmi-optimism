import { useEffect, useState } from 'react'
import Erc721ABI from '../assets/abi/erc721_full.json'
import { useChainId, useContractRead, useContractReads } from 'wagmi'
import axios from 'axios'

const useGetNFTCollection = (
  contractAddress?: `0x${string}`,
  walletAddress?: `0x${string}`
) => {
  const [data, setData] = useState<any[]>()
  const chainId = useChainId()
  const { data: totalNFT } = useContractRead(
    contractAddress
      ? {
          abi: Erc721ABI,
          address: contractAddress,
          args: [walletAddress],
          functionName: 'balanceOf',
          watch: true,
          enabled: !!contractAddress,
          chainId,
          select: (data) => data?.toString(),
        }
      : undefined
  )

  const newArray = totalNFT ? (Array(Number(totalNFT)).fill(0) as number[]) : []
  const calls = newArray.map((_, index) => ({
    abi: Erc721ABI,
    functionName: 'tokenOfOwnerByIndex',
    address: contractAddress,
    args: [walletAddress, index],
    chainId,
  }))

  const { data: tokenID } = useContractReads({
    contracts: newArray.length > 0 ? calls : [],
    watch: true,
    enabled: newArray?.length > 0,
    select: (value) => {
      return value.map((value) => value?.result.toString())
    },
  })

  const callsTokenURI = tokenID?.map((tokenId) => ({
    abi: Erc721ABI,
    functionName: 'tokenURI',
    address: contractAddress,
    args: [tokenId],
    chainId,
  }))

  const { data: tokenURI } = useContractReads({
    contracts: tokenID ? callsTokenURI : [],
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
