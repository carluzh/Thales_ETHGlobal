'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowDown, ChevronDown } from 'lucide-react'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Modal, useModal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Token, TOKENS } from './TokenSelect'

interface SwapCardProps {
  className?: string
}

export const SwapCard = ({ className }: SwapCardProps) => {
  const [fromToken, setFromToken] = useState<Token | null>(TOKENS[0]) // ETH
  const [toToken, setToToken] = useState<Token | null>(TOKENS[1]) // USDC
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [selectingFor, setSelectingFor] = useState<'from' | 'to'>('from')
  const [searchQuery, setSearchQuery] = useState('')

  const tokenModal = useModal()

  const handleTokenSelect = useCallback(
    (token: Token) => {
      if (selectingFor === 'from') {
        if (toToken?.address === token.address) {
          setToToken(fromToken)
        }
        setFromToken(token)
      } else {
        if (fromToken?.address === token.address) {
          setFromToken(toToken)
        }
        setToToken(token)
      }
      tokenModal.hide()
      setSearchQuery('')
    },
    [selectingFor, fromToken, toToken, tokenModal],
  )

  const handleSwapTokens = () => {
    const tempToken = fromToken
    const tempAmount = fromAmount
    setFromToken(toToken)
    setToToken(tempToken)
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const openTokenModal = (type: 'from' | 'to') => {
    setSelectingFor(type)
    setSearchQuery('')
    tokenModal.show()
  }

  const filteredTokens = TOKENS.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      {/* Main Swap Card - styled like polar's widgets (MonthWidget, AccountWidget) */}
      <motion.div
        className={cn(
          'flex w-full max-w-[480px] flex-col rounded-3xl bg-gray-50 dark:bg-polar-800',
          className,
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header Section - like AccountWidget */}
        <div className="flex flex-col gap-y-4 p-6 pb-2">
          <div className="flex flex-row items-center justify-between">
            <span className="text-lg">Swap</span>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl border-none"
            >
              Settings
            </Button>
          </div>
        </div>

        {/* Swap Interface - white inner section like polar widgets */}
        <div className="m-2 flex flex-col gap-y-4 rounded-2xl bg-white p-4 dark:bg-polar-900">
          {/* From Token Section */}
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-polar-500">
                You pay
              </span>
              <span className="text-xs text-gray-400 dark:text-polar-600">
                Balance: 0.00 {fromToken?.symbol}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-5xl font-light outline-none placeholder:text-gray-200 focus:border-blue-300 focus:ring-[3px] focus:ring-blue-100 dark:border-polar-700 dark:placeholder:text-polar-600 dark:focus:border-blue-600 dark:focus:ring-blue-700/40"
              />
              <Button
                onClick={() => openTokenModal('from')}
                variant="ghost"
                className="flex h-auto items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 hover:bg-gray-50 dark:border-polar-700 dark:hover:bg-polar-800"
              >
                {fromToken ? (
                  <>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white">
                      {fromToken.symbol.charAt(0)}
                    </div>
                    <span className="font-medium">{fromToken.symbol}</span>
                  </>
                ) : (
                  <span>Select</span>
                )}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 dark:text-polar-600">
                ~$0.00
              </span>
              <button className="text-sm font-medium text-blue-500 hover:text-blue-600">
                Max
              </button>
            </div>
          </div>

          {/* Swap Direction Button */}
          <div className="relative flex items-center justify-center">
            <button
              onClick={handleSwapTokens}
              className="rounded-xl border-4 border-white bg-gray-100 p-2 transition-colors hover:bg-gray-200 dark:border-polar-900 dark:bg-polar-800 dark:hover:bg-polar-700"
            >
              <ArrowDown className="h-5 w-5" />
            </button>
          </div>

          {/* To Token Section */}
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-polar-500">
                You receive
              </span>
              <span className="text-xs text-gray-400 dark:text-polar-600">
                Balance: 0.00 {toToken?.symbol}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-5xl font-light outline-none placeholder:text-gray-200 focus:border-blue-300 focus:ring-[3px] focus:ring-blue-100 dark:border-polar-700 dark:placeholder:text-polar-600 dark:focus:border-blue-600 dark:focus:ring-blue-700/40"
              />
              <Button
                onClick={() => openTokenModal('to')}
                variant="ghost"
                className="flex h-auto items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 hover:bg-gray-50 dark:border-polar-700 dark:hover:bg-polar-800"
              >
                {toToken ? (
                  <>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white">
                      {toToken.symbol.charAt(0)}
                    </div>
                    <span className="font-medium">{toToken.symbol}</span>
                  </>
                ) : (
                  <span>Select</span>
                )}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </div>
            <span className="text-sm text-gray-400 dark:text-polar-600">
              ~$0.00
            </span>
          </div>

          {/* Action Button - styled like polar */}
          <Button
            className="mt-2 h-12 w-full rounded-xl text-base font-medium"
            disabled={!fromAmount || !fromToken || !toToken}
          >
            {!fromToken || !toToken
              ? 'Select tokens'
              : !fromAmount
                ? 'Enter amount'
                : 'Swap'}
          </Button>
        </div>
      </motion.div>

      {/* Token Selection Modal - styled like polar's dropdowns */}
      <Modal
        title="Select Token"
        isShown={tokenModal.isShown}
        hide={tokenModal.hide}
        modalContent={
          <div className="flex flex-col">
            {/* Search Input - styled like polar's ProductSelect */}
            <div className="border-b border-gray-100 p-4 dark:border-polar-800">
              <Input
                type="text"
                placeholder="Search by name or symbol"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Token List */}
            <div className="max-h-[400px] overflow-y-auto p-2">
              {filteredTokens.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500 dark:text-polar-500">
                  No tokens found
                </div>
              ) : (
                filteredTokens.map((token) => {
                  const isSelected =
                    (selectingFor === 'from' && fromToken?.address === token.address) ||
                    (selectingFor === 'to' && toToken?.address === token.address)
                  const isDisabled =
                    (selectingFor === 'from' && toToken?.address === token.address) ||
                    (selectingFor === 'to' && fromToken?.address === token.address)

                  return (
                    <button
                      key={token.address}
                      onClick={() => !isDisabled && handleTokenSelect(token)}
                      disabled={isDisabled}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors',
                        isSelected
                          ? 'bg-gray-100 dark:bg-polar-800'
                          : 'hover:bg-gray-50 dark:hover:bg-polar-800',
                        isDisabled && 'cursor-not-allowed opacity-50',
                      )}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-bold text-white">
                        {token.symbol.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{token.symbol}</span>
                        <span className="text-sm text-gray-500 dark:text-polar-500">
                          {token.name}
                        </span>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        }
      />
    </>
  )
}
