import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { iconButtonClassName } from '@/components/shared/iconButtonStyles'
import { durations, easings } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { useLang } from '@/lib/i18n'
import { t } from '@/data/translations'

export const BackToTop = () => {
  const { lang } = useLang()
  const tx = t(lang)
  const reduceMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Closure local evita disparar setState com mesmo valor (skip re-render desnecessário)
    let visible = false
    const handleScroll = () => {
      const next = window.scrollY > 400
      if (next !== visible) {
        visible = next
        setIsVisible(next)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: reduceMotion ? 0 : durations.micro, ease: easings.swift }}
          onClick={scrollToTop}
          className={cn(
            iconButtonClassName('solid', 'lg'),
            'fixed bottom-6 right-6 z-40 shadow-lg'
          )}
          aria-label={tx.nav.backToTop}
        >
          <ArrowUp size={20} aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
