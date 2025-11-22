'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import React, { useCallback, useEffect, type JSX } from 'react'
import ReactDOM from 'react-dom'
import FocusLock from 'react-focus-lock'
import { Button } from './button'

export interface ModalProps {
  title: string
  isShown: boolean
  hide: () => void
  modalContent: JSX.Element
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  title,
  isShown,
  hide,
  modalContent,
  className,
}) => {
  const ref = React.useRef<HTMLDivElement>(null)

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const contains = ref.current?.contains(event.target as Node)

      if (event.keyCode === 27 && isShown && contains) {
        hide()
      }
    },
    [hide, isShown],
  )

  useEffect(() => {
    if (isShown) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isShown, hide])

  const onInnerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const modal = (
    <React.Fragment>
      <FocusLock>
        <div
          ref={ref}
          className="fixed top-0 right-0 bottom-0 left-0 z-50 overflow-hidden focus-within:outline-none dark:text-white"
          aria-modal
          tabIndex={-1}
          role="dialog"
          onKeyDown={onKeyDown}
        >
          <div
            className="flex h-full flex-col items-center bg-gray-100/80 backdrop-blur-sm dark:bg-polar-900/80 p-4"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              hide()
            }}
          >
            <div className="block h-20 w-2 lg:max-h-[10%] lg:grow-2"></div>
            <motion.div
              className={cn(
                'dark:bg-polar-900 dark:border-polar-800 relative z-10 flex max-h-full w-full flex-col gap-y-1 overflow-x-hidden overflow-y-auto rounded-3xl bg-gray-100 p-1 shadow-sm lg:w-[480px] lg:max-w-full dark:border',
                className,
              )}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.1, ease: 'easeInOut' }}
              onClick={onInnerClick}
            >
              <div className="flex flex-row items-center justify-between pt-1 pr-1 pb-0 pl-4 text-sm">
                <span className="dark:text-polar-500 text-gray-500">
                  {title}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="dark:text-polar-500 dark:hover:text-polar-400 size-8 rounded-full text-gray-500 hover:text-gray-600"
                  onClick={hide}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="dark:bg-polar-800 flex flex-col overflow-y-auto rounded-[20px] bg-white">
                {modalContent}
              </div>
            </motion.div>
          </div>
        </div>
      </FocusLock>
    </React.Fragment>
  )

  return isShown ? ReactDOM.createPortal(modal, document.body) : null
}

export const ModalBox = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        'dark:bg-polar-700 z-0 flex h-full w-full flex-col space-y-2 overflow-hidden rounded-2xl bg-gray-50 p-5 shadow-2xl',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function useModal() {
  const [isShown, setIsShown] = React.useState(false)

  const toggle = useCallback(() => {
    setIsShown((prev) => !prev)
  }, [])

  const show = useCallback(() => {
    setIsShown(true)
  }, [])

  const hide = useCallback(() => {
    setIsShown(false)
  }, [])

  return {
    isShown,
    toggle,
    show,
    hide,
  }
}
