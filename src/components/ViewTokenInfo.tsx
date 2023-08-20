import { useState } from 'react'
import useTokenInfo from '../hooks/useTokensInfo'
import { formatUnits } from 'ethers'

type Address = `0x${string}`

export default function ViewTokenInfo() {
  const [value, setValue] = useState<string>()
  const data = useTokenInfo({
    contractAddress: [
      '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
      '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    ],
    walletAddress: value as Address,
  })

  return (
    <div>
      <input
        placeholder='enter Address'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {data?.names?.map((item, index) => (
        <div key={index}>
          name: {item.result} <br />
          symbol: {data?.symbols?.[index].result}
          <br />
          decimals: {data?.decimals?.[index].result}
          <br />
          balance:
          {data?.balance &&
            data?.decimals &&
            formatUnits(
              data.balance?.[index].result.toString() || '0',
              data.decimals?.[index].result || '18'
            )}
        </div>
      ))}
    </div>
  )
}
