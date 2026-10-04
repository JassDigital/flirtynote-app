export function Button({ children, onClick, className, disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-xl font-medium ${className}`}
    >
      {children}
    </button>
  );
}
