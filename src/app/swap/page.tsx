'use client'

import { SwapCard } from '@/components/swap/SwapCard'
import { motion } from 'framer-motion'

export default function SwapPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full flex-col items-center bg-gray-50 px-4 py-8 dark:bg-polar-900 md:py-16">
      {/* Page Container */}
      <motion.div
        className="flex w-full max-w-7xl flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Swap Card - centered like polar dashboard */}
        <SwapCard />
      </motion.div>
    </div>
  )
}
