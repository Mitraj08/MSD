import { useEffect } from 'react'
import './Modal.css'

/**
 * Generic overlay dialog. It has no idea what it will render inside -
 * that's passed in as children - so the exact same component handles
 * the recipe detail view here and could handle any other dialog
 * elsewhere in the app (confirmations, forms, etc).
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {React.ReactNode} props.children
 */
function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
