type DisplayProps = {
  displayText: string;
};

export function Display({ displayText }: DisplayProps) {
  return (
    <div className="flex w-[70vw] max-w-[800px] h-[inherit] bg-mygrey rounded-[20px]">
      <div className="m-10 text-left overflow-y-scroll">
        <p className="text-mywhite text-[18px]">{displayText}</p>
      </div>
    </div>
  );
}
