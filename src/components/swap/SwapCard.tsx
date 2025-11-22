'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ArrowDown, Check } from 'lucide-react'
import { useState, useCallback, useId, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Modal, useModal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { TokenSelect, type Token, TOKENS } from './TokenSelect'

interface SwapCardProps {
  className?: string
}

interface SwapAmountFieldProps {
  id: string
  label: string
  balanceLabel: string
  helperLabel: string
  amount: string
  onAmountChange: (value: string) => void
  token: Token | null
  onTokenSelect: () => void
  actionLabel?: string
  onAction?: () => void
}

const SwapAmountField = ({
  id,
  label,
  balanceLabel,
  helperLabel,
  amount,
  onAmountChange,
  token,
  onTokenSelect,
  actionLabel,
  onAction,
}: SwapAmountFieldProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-gray-600 dark:text-polar-400">{label}</span>
        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-polar-600">
          <span>{balanceLabel}</span>
          {actionLabel ? (
            <button
              type="button"
              onClick={onAction}
              disabled={!onAction}
              className="rounded-full px-3 py-1 text-xs font-semibold text-blue-500 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-blue-400 dark:hover:bg-blue-950/40"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col rounded-2xl border border-gray-100/80 bg-gray-50/80 px-4 py-3 shadow-xs dark:border-polar-800 dark:bg-polar-900/60">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex-1">
            <label htmlFor={id} className="sr-only">
              {label}
            </label>
            <input
              id={id}
              type="text"
              inputMode="decimal"
              pattern="[0-9.]*"
              value={amount}
              onChange={(event) => onAmountChange(event.target.value)}
              placeholder="0.00"
              className="w-full bg-transparent text-5xl font-light leading-tight text-gray-900 placeholder:text-gray-300 focus:outline-none dark:text-white dark:placeholder:text-polar-700"
            />
            <span className="mt-1 block text-sm text-gray-400 dark:text-polar-600">
              {helperLabel}
            </span>
          </div>
          <TokenSelect
            token={token}
            onSelect={onTokenSelect}
            className="shrink-0"
          />
        </div>
      </div>
    </div>
  )
}

export const SwapCard = ({ className }: SwapCardProps) => {
  const [fromToken, setFromToken] = useState<Token | null>(TOKENS[0]) // ETH
  const [toToken, setToToken] = useState<Token | null>(TOKENS[1]) // USDC
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [selectingFor, setSelectingFor] = useState<'from' | 'to'>('from')
  const [searchQuery, setSearchQuery] = useState('')

  const tokenModal = useModal()
  const fromAmountInputId = useId()
  const toAmountInputId = useId()

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

  const parsedFromAmount = Number(fromAmount)
  const parsedToAmount = Number(toAmount)
  const derivedRate =
    parsedFromAmount > 0 && parsedToAmount > 0
      ? (parsedToAmount / parsedFromAmount).toLocaleString(undefined, {
          maximumFractionDigits: 6,
        })
      : null

  const swapDetails: { label: string; value: ReactNode }[] = [
    {
      label: 'Network',
      value: 'Base Sepolia',
    },
    {
      label: 'Route',
      value: 'Uniswap v4 Hook',
    },
    {
      label: 'Rate',
      value:
        derivedRate && fromToken && toToken
          ? `1 ${fromToken.symbol} ≈ ${derivedRate} ${toToken.symbol}`
          : '—',
    },
  ]

  return (
    <>
      {/* Main Swap Card - styled like polar's widgets (MonthWidget, AccountWidget) */}
      <motion.div
        className={cn(
          'flex w-full max-w-[520px] flex-col rounded-4xl bg-gray-50 shadow-3xl dark:bg-polar-800',
          className,
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-y-3 p-6 pb-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-polar-500">
            Swap
          </span>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Unified Hook Routing
              </h2>
              <p className="text-sm text-gray-500 dark:text-polar-400">
                Route trades through the Polar-inspired modal
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full border border-gray-200 bg-white/70 px-4 text-sm font-medium text-gray-700 hover:bg-white dark:border-polar-700 dark:bg-polar-900 dark:text-polar-200 dark:hover:bg-polar-800"
            >
              Settings
            </Button>
          </div>
        </div>

        {/* Swap Interface - white inner section like polar widgets */}
        <div className="m-2 flex flex-col gap-y-5 rounded-3xl bg-white p-5 shadow-lg dark:bg-polar-900">
          <SwapAmountField
            id={fromAmountInputId}
            label="You pay"
            balanceLabel={`Balance: 0.00 ${fromToken?.symbol ?? ''}`}
            helperLabel="~$0.00"
            amount={fromAmount}
            onAmountChange={setFromAmount}
            token={fromToken}
            onTokenSelect={() => openTokenModal('from')}
            actionLabel="Max"
          />

          {/* Swap Direction Button */}
          <div className="relative flex items-center justify-center">
            <span
              aria-hidden
              className="absolute left-6 right-6 h-px bg-gray-100 dark:bg-polar-800"
            />
            <button
              type="button"
              onClick={handleSwapTokens}
              className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-polar-700 dark:bg-polar-800 dark:text-white"
            >
              <ArrowDown className="h-5 w-5" />
            </button>
          </div>

          <SwapAmountField
            id={toAmountInputId}
            label="You receive"
            balanceLabel={`Balance: 0.00 ${toToken?.symbol ?? ''}`}
            helperLabel="~$0.00"
            amount={toAmount}
            onAmountChange={setToAmount}
            token={toToken}
            onTokenSelect={() => openTokenModal('to')}
          />

          <div className="rounded-2xl border border-gray-100/80 bg-gray-50/70 px-4 py-3 dark:border-polar-800 dark:bg-polar-900/70">
            <div className="divide-y divide-gray-100 text-sm dark:divide-polar-800">
              {swapDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-center justify-between py-2 first:pt-0 last:pb-0"
                >
                  <span className="text-gray-500 dark:text-polar-500">
                    {detail.label}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button - styled like polar */}
          <Button
            className="mt-1 h-12 w-full rounded-2xl text-base font-semibold shadow-lg"
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
                className="h-11 w-full rounded-2xl border border-gray-100 bg-gray-50/80 px-4 text-sm dark:border-polar-700 dark:bg-polar-900/70"
              />
            </div>

            {/* Token List */}
            <div className="max-h-[420px] overflow-y-auto p-2">
              <p className="px-3 py-2 text-xxs font-semibold uppercase tracking-[0.3em] text-gray-400 dark:text-polar-500">
                Available tokens
              </p>
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
                        'flex w-full items-center justify-between rounded-2xl border border-transparent p-3 text-left transition-colors',
                        isSelected
                          ? 'border-blue-200 bg-blue-50/70 dark:border-blue-900/40 dark:bg-blue-950/30'
                          : 'hover:border-gray-200 hover:bg-gray-50 dark:hover:border-polar-700 dark:hover:bg-polar-800',
                        isDisabled && 'cursor-not-allowed opacity-50',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-bold text-white shadow-sm">
                          {token.symbol.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-medium">
                            {token.symbol}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-polar-500">
                            {token.name}
                          </span>
                        </div>
                      </div>
                      {isSelected ? (
                        <Check className="h-4 w-4 text-blue-500" />
                      ) : null}
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
