import type { InputHTMLAttributes } from 'react';

interface AuthFormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  labelRight?: React.ReactNode;
}

export default function AuthFormInput({ id, label, labelRight, ...props }: AuthFormInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {labelRight}
      </div>
      <input
        id={id}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        {...props}
      />
    </div>
  );
}
