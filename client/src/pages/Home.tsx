import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const [error, setError] = useState<unknown>();
  //displayText state
  //isRedacted state

  if (error) {
    return (
      <>
        <h2>
          {error instanceof Error
            ? String(error)
            : `An unexpected error occurred: ${error}`}
        </h2>
      </>
    );
  }

  return (
    <>
      <Display
        displayText={
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        }
      />
      <form className="flex justify-center items-center w-full m-[35px]">
        <Prompt onError={setError} />
        <SelectFilterSet />
        <RedactPrompt isRedacted={false} />
      </form>
    </>
  );
}

type DisplayProps = {
  displayText: string;
};

function Display({ displayText }: DisplayProps) {
  return (
    <div className="flex w-[70vw] max-w-[800px] h-[50vh] bg-mygrey rounded-[20px]">
      <div className="m-10 text-left overflow-y-scroll">
        <p className="text-mywhite text-[18px]">{displayText}</p>
      </div>
    </div>
  );
}

type PromptProps = {
  onError: (error: unknown) => void;
};

function Prompt({ onError }: PromptProps) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxHeight = 200;

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) throw new Error('Unable to load prompter!');
    textarea.style.height = '40px'; // Set to the default height
    const isContentLessThanDefault = textarea.scrollHeight < 64; // Adjust as per the observed default scrollHeight
    if (!inputText || isContentLessThanDefault) {
      // If there is no text or content is less than the default height, set a small fixed height
      textarea.style.height = '40px';
    } else {
      const currentScrollHeight = textarea.scrollHeight;
      // Set the height to the larger of the scrollHeight and maxHeight
      textarea.style.height = `${Math.min(currentScrollHeight, maxHeight)}px`;
    }
  }, [inputText]);

  useEffect(() => {
    try {
      adjustHeight();
    } catch (error) {
      onError(error);
    }
  }, [inputText, adjustHeight, onError]);
  return (
    <div>
      <textarea
        ref={textareaRef}
        name="prompt"
        className="flex items-center bg-myconcrete border-[1px] border-black rounded-[40px] pt-2 pb-2 pl-6 pr-6 ml-1 mr-1 overflow-y-scroll resize-none w-[40vw] text-[15px]"
        placeholder="Select Filter Set, Write, Redact, Prompt!"
        onChange={(e) => {
          setInputText(e.currentTarget.value);
        }}
        rows={1}
        value={inputText}
        required
      />
    </div>
  );
}

function SelectFilterSet() {
  const navigate = useNavigate();
  const [filterSet, setFilterSet] = useState('');
  if (filterSet === 'Create') {
    navigate('/filter-sets');
  }
  return (
    <div>
      <select
        name="filterSets"
        value={filterSet}
        onChange={(e) => setFilterSet(e.currentTarget.value)}
        className="flex items-center text-center text-mywhite rounded-[40px] p-1 ml-1 mr-1 border-[5.5px] border-black w-[98px] min-w-[98px] text-[15px] h-[40px] bg-black select-none">
        <option className="hidden" value="">
          Filter Set
        </option>
        <option value="">None</option>
        <option value="Create">+Create Filter Set</option>
      </select>
    </div>
  );
}

type RedactPromptProps = {
  isRedacted: boolean;
};

function RedactPrompt({ isRedacted }: RedactPromptProps) {
  let styles = '';
  if (isRedacted) {
    styles = 'bg-myyellow border-myyellow text-black hover:border-black';
  } else {
    styles = 'bg-black border-black text-mywhite hover:border-mywhite';
  }
  return (
    <div>
      <button
        type={isRedacted ? 'button' : 'submit'}
        className={`flex justify-center items-center text-center rounded-[40px] pt-1 pb-1 pl-2 pr-2 ml-1 mr-1 border-[5.5px] min-w-[73.55px] text-[15px] h-[40px] select-none
        ${styles}`}>
        Redact
      </button>
    </div>
  );
}
