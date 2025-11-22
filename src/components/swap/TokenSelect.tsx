'use client'

import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  logoURI?: string
}

interface TokenSelectProps {
  token: Token | null
  onSelect: () => void
  className?: string
}

export const TokenSelect = ({ token, onSelect, className }: TokenSelectProps) => {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex items-center gap-2 rounded-full px-3 py-2 transition-colors',
        'bg-gray-100 hover:bg-gray-200',
        'dark:bg-polar-700 dark:hover:bg-polar-600',
        className,
      )}
    >
      {token ? (
        <>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white">
            {token.symbol.charAt(0)}
          </div>
          <span className="font-medium">{token.symbol}</span>
        </>
      ) : (
        <span className="font-medium">Select token</span>
      )}
      <ChevronDown className="h-4 w-4 opacity-60" />
    </button>
  )
}

// Token list for the modal
export const TOKENS: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
    decimals: 6,
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    decimals: 18,
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
  },
]

interface TokenListProps {
  onSelect: (token: Token) => void
  excludeToken?: Token | null
}

export const TokenList = ({ onSelect, excludeToken }: TokenListProps) => {
  const filteredTokens = TOKENS.filter(
    (token) => token.address !== excludeToken?.address,
  )

  return (
    <div className="flex flex-col gap-1 p-2">
      {filteredTokens.map((token) => (
        <button
          key={token.address}
          onClick={() => onSelect(token)}
          className={cn(
            'flex items-center gap-3 rounded-xl p-3 text-left transition-colors',
            'hover:bg-gray-100 dark:hover:bg-polar-700',
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-bold text-white">
            {token.symbol.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{token.symbol}</span>
            <span className="text-sm text-gray-500 dark:text-polar-400">
              {token.name}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
