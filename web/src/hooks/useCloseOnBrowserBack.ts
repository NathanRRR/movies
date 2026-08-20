import { useCallback, useEffect, useRef } from 'react'

/**
 * Makes a modal-like UI participate in browser history: opening it pushes a
 * history entry, so the mobile swipe-back gesture (or the hardware/back
 * button) closes the modal instead of navigating away from the page.
 */
export function useCloseOnBrowserBack(isOpen: boolean, onClose: () => void) {
  const hasPushedRef = useRef(false)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    window.history.pushState({ modal: true }, '')
    hasPushedRef.current = true

    const handlePopState = () => {
      hasPushedRef.current = false
      onCloseRef.current()
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isOpen])

  return useCallback(() => {
    if (hasPushedRef.current) {
      hasPushedRef.current = false
      window.history.back()
    } else {
      onCloseRef.current()
    }
  }, [])
}
