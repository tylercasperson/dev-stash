interface EditorTabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function EditorTabButton({ active, onClick, children }: EditorTabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
        active ? 'bg-[#3a3a3a] text-[#d4d4d4]' : 'text-[#6b7280] hover:text-[#d4d4d4]'
      }`}
    >
      {children}
    </button>
  );
}
