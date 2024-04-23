type ButtonProps = {
  type?: 'submit' | 'reset' | 'button' | undefined;
  text: string;
};
/* This button has not proved to be very reusable... */
export function Button({ type, text }: ButtonProps) {
  return (
    <button
      type={type}
      className="flex whitespace-nowrap items-center justify-center text-white rounded-[20px] w-[70px] h-[25px] select-none">
      {text}
    </button>
  );
}
