import './Button.css'

/**
 * Reusable button used across the app for every clickable action.
 * Centralising it here means every button shares the same sizing,
 * focus, and disabled behaviour instead of being re-styled ad hoc.
 *
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'} [props.variant] - visual style
 * @param {'sm'|'md'} [props.size] - button size
 * @param {React.ReactNode} props.children
 * @param {() => void} [props.onClick]
 * @param {boolean} [props.disabled]
 * @param {string} [props.type]
 */
function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
