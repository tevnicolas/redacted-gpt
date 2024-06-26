type ButtonProps = {
  type?: 'submit' | 'reset' | 'button' | undefined;
  className?: string;
  disabled?: boolean;
  text: string;
  onClick?: () => void;
};

export function Button({
  type,
  text,
  className,
  onClick,
  disabled,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      type={type}
      className={`flex whitespace-nowrap items-center justify-center text-white rounded-[20px] w-[70px] h-[25px] select-none ${className}`}
      onClick={onClick}>
      {text}
    </button>
  );
}
