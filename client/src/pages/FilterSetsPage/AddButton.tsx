type AddButtonProps = {
  onClick: () => void;
};

export function AddButton({ onClick }: AddButtonProps) {
  return (
    <div
      onClick={onClick}
      className="flex absolute w-[34px] h-[34px] rounded-[40px] bg-mygrey right-8 top-4 cursor-pointer">
      <div className="relative flex justify-center items-center w-full h-full">
        <div className="absolute bg-mywhite w-4 h-[3px] rounded-[40px]" />
        <div className="absolute bg-mywhite h-4 w-[3px] rounded-[40px]" />
      </div>
    </div>
  );
}
