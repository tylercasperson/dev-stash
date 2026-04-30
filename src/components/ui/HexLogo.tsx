interface HexLogoProps {
  size?: 'sm' | 'md';
  className?: string;
}

export default function HexLogo({ size = 'md', className }: HexLogoProps) {
  const [w, h] = size === 'sm' ? [18, 20] : [20, 22];
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 20 22"
      fill="none"
      className={className ?? 'text-blue-400'}
    >
      <path
        d="M10 1L18.66 6V16L10 21L1.34 16V6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
