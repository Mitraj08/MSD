import { useEffect, useState } from 'react';
import { errorMessage } from '../api.js';

export const COURSES = ['B.Tech CSE', 'B.Tech IT', 'BCA', 'MCA', 'B.Sc IT', 'MBA'];

const emptyValues = { name: '', email: '', phone: '', course: COURSES[0], year: '1' };

const validate = (v) => {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Enter a valid email address.';
  if (!/^\d{10}$/.test(v.phone.trim())) e.phone = 'Phone number must be exactly 10 digits.';
  return e;
};

export default function StudentForm({ editing, onSave, onCancel }) {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues(
      editing
        ? {
            name: editing.name,
            email: editing.email,
            phone: editing.phone,
            course: editing.course,
            year: String(editing.year),
          }
        : emptyValues
    );
    setErrors({});
    setFormError('');
  }, [editing]);

  const change = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      await onSave({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        course: values.course,
        year: Number(values.year),
      });
      if (!editing) setValues(emptyValues);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      setFormError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={values[name]}
        onChange={change}
        aria-invalid={Boolean(errors[name])}
        {...props}
      />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <form className="panel form" onSubmit={submit} noValidate>
      <h2>{editing ? `Edit ${editing.name}` : 'Add a student'}</h2>

      {field('name', 'Full name', { autoComplete: 'off' })}
      {field('email', 'Email', { type: 'email', autoComplete: 'off' })}
      {field('phone', 'Phone (10 digits)', { inputMode: 'numeric', maxLength: 10 })}

      <div className="row">
        <div className="field">
          <label htmlFor="course">Course</label>
          <select id="course" name="course" value={values.course} onChange={change}>
            {COURSES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="year">Year</label>
          <select id="year" name="year" value={values.year} onChange={change}>
            {[1, 2, 3, 4].map((y) => (
              <option key={y} value={y}>
                Year {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {formError && <p className="form-error" role="alert">{formError}</p>}

      <div className="form-actions">
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Saving...' : editing ? 'Save changes' : 'Add student'}
        </button>
        {editing && (
          <button type="button" className="btn btn-quiet" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
