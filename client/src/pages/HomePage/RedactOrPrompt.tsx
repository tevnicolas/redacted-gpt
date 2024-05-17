type RedactOrPromptProps = {
  isRedacted: boolean;
  onPrompt: () => void;
  onRedact: () => void;
};

export function RedactOrPrompt({
  isRedacted,
  onPrompt,
  onRedact,
}: RedactOrPromptProps) {
  let styles = '';
  if (isRedacted) {
    styles =
      'bg-myyellow border-myyellow text-black hover:bg-green-600 hover:border-green-600 hover:text-white';
  } else {
    styles =
      'bg-mywhite border-mywhite text-black hover:bg-blue-500 hover:border-blue-500 hover:text-white';
  }
  return (
    <div className="mt-[15px]">
      <button
        type="button"
        onClick={isRedacted ? onPrompt : onRedact}
        className={`flex justify-center items-center text-center rounded-[40px] pt-1 pb-1 pl-2 pr-2 ml-1 mr-1 border-[5.5px] min-w-[40px] max-w-[73.55px] text-[15px] h-[39px] select-none bw-488:min-w-[73.55px]
        ${styles}`}>
        {isRedacted ? 'Prompt' : 'Redact'}
      </button>
    </div>
  );
}
