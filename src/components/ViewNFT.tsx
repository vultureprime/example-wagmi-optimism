import { useState } from 'react'
import useGetNFTCollection from '../hooks/useGetNFTCollection'

type Address = `0x${string}`
export default function ViewNFT() {
  const [value, setValue] = useState<string>()
  const { data } = useGetNFTCollection({
    contractAddress: '0x7c230d7a7efbf17b2ebd2aac24a8fb5373e381b7',
    walletAddress: value as Address,
  })

  return (
    <div>
      <input
        placeholder='enter Address'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {data?.map((item, index) => (
        <div key={index}>
          <img src={item?.image.replace('ipfs://', 'https://ipfs.io/ipfs/')} />
          <p>{item?.name}</p>
          <p>{item?.description}</p>
          <p>{item?.creator}</p>
          {item?.attributes.map((attribute) => (
            <div key={attribute?.trait_type}>
              {attribute?.trait_type} :{attribute?.value}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
