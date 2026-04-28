export default function AuthFormLayout({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-h-screen items-center justify-center bg-background px-4 ${className ?? ''}`}>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
