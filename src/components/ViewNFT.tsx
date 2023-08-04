import React from 'react'
import useGetNFTCollection from '../hooks/useGetNFTCollection'

export default function ViewNFT() {
  const { data } = useGetNFTCollection(
    '0x7c230d7a7efbf17b2ebd2aac24a8fb5373e381b7',
    '0xc49e9d0ebA971990007B30D3052B243E45D3e7b0'
  )

  return (
    <div>
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
