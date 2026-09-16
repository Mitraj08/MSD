import './FormField.css'

/**
 * A single labeled form control, reused for every field in the
 * student form whether it's a text input or a select. It is a
 * CONTROLLED COMPONENT wrapper: it never keeps its own copy of the
 * value — `value` and `onChange` always come from the parent, so
 * the parent's state is the single source of truth at all times.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.name
 * @param {string} [props.type]
 * @param {'input'|'select'} [props.as]
 * @param {string[]} [props.options] - required when as="select"
 * @param {string} props.value
 * @param {(e: React.ChangeEvent) => void} props.onChange
 * @param {(e: React.FocusEvent) => void} props.onBlur
 * @param {string} [props.error] - validation message, if any
 * @param {boolean} [props.showError] - whether to display the error
 *   (usually true once the field has been touched or submit was tried)
 * @param {boolean} [props.required]
 * @param {string} [props.placeholder]
 */
function FormField({
  label,
  name,
  type = 'text',
  as = 'input',
  options = [],
  value,
  onChange,
  onBlur,
  error,
  showError,
  required = false,
  placeholder
}) {
  const displayError = showError && error
  const isValid = showError && !error

  return (
    <div
      className={`form-field ${displayError ? 'has-error' : ''} ${isValid ? 'is-valid' : ''}`}
    >
      <label htmlFor={name}>
        {label}
        {required && <span className="form-field__asterisk"> *</span>}
      </label>

      <div className="form-field__control">
        {as === 'select' ? (
          <select id={name} name={name} value={value} onChange={onChange} onBlur={onBlur}>
            <option value="">Select {label.toLowerCase()}…</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            autoComplete="off"
          />
        )}
        {isValid && (
          <span className="form-field__tick" aria-hidden="true">
            ✓
          </span>
        )}
      </div>

      {displayError && <p className="form-field__error">{error}</p>}
    </div>
  )
}

export default FormField
