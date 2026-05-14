import { type ReactNode } from 'react'

interface FormFieldProps {
  label: string
  htmlFor?: string
  error?: string
  children: ReactNode
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[12px] font-semibold tracking-[-0.01em] text-[var(--ios-ink-2)]"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-0.5 text-[12px] font-medium text-[var(--ios-red)] tracking-[-0.01em]">{error}</p>
      )}
    </div>
  )
}
