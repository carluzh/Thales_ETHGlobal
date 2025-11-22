'use client'

import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LogOut, Wallet } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'

const NAV_ITEMS = [
  { name: 'Swap', href: '/swap' },
  { name: 'Liquidity', href: '/liquidity' },
]

export function Navbar() {
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement>(null)
  const [blurX, setBlurX] = useState<number | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()

  // tracks cursor for subtle parallax on glow
  const updateBlur = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const headerRect = headerRef.current?.getBoundingClientRect()
    if (!headerRect) return
    const center = rect.left - headerRect.left + rect.width / 2
    const offset = (e.clientX - headerRect.left - center) * 0.15
    setBlurX(center + offset)
  }

  return (
    <header ref={headerRef} className="relative p-4">
      {/* glow sits behind navbar via z-index */}
      {blurX !== null && (
        <div
          className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-32 rounded-full bg-primary/50 blur-2xl"
          style={{ left: blurX }}
        />
      )}

      <div className="container relative z-10 mx-auto flex items-center justify-between py-3 pl-6 pr-3 bg-gray-100 dark:bg-polar-800 border border-gray-100 dark:border-white/5 rounded-2xl">
        {/* logo */}
        <Link href="/">
          <img src="/Logo.png" alt="Thales" className="h-[22px]" />
        </Link>

        {/* nav links */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                pathname === href
                  ? 'text-black dark:text-white'
                  : 'text-muted-foreground hover:text-black dark:hover:text-white'
              )}
            >
              {name}
            </Link>
          ))}
        </nav>

        {/* wallet button */}
        <Button
          size="sm"
          onClick={address ? () => disconnect() : openConnectModal}
          onMouseEnter={(e) => {
            setIsHovering(true)
            if (!address) updateBlur(e)
          }}
          onMouseMove={(e) => !address && updateBlur(e)}
          onMouseLeave={() => {
            setIsHovering(false)
            setBlurX(null)
          }}
          className={cn(
            'rounded-xl cursor-pointer transition-all min-w-[160px]',
            address
              ? 'bg-gray-100 dark:bg-polar-700 hover:bg-gray-100 dark:hover:bg-polar-700 text-gray-900 dark:text-white'
              : 'bg-primary text-white border border-white/10'
          )}
        >
          {address && isHovering ? (
            <LogOut className="mr-2 h-4 w-4" />
          ) : (
            <Wallet className="mr-2 h-4 w-4" />
          )}
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect Wallet'}
        </Button>
      </div>
    </header>
  )
}
