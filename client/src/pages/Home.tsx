import { useEffect, useState, useRef, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
// import { FilterSet, UnsavedFilterSet } from '../lib/data';

export function Home() {
  const [error, setError] = useState<unknown>();
  //displayText state
  const [inputText, setInputText] = useState('');
  const [isRedacted, setIsRedacted] = useState(false);
  const [currentSet, setCurrentSet] = useState('');
  // const [redactedText, setRedactedText] = useState('');

  async function handleRedact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      // const formData = new FormData(e.currentTarget);
      // const userInputs = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputText, filterSet: currentSet }),
      };
      const res = await fetch('/api/presidio', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const redacted = await res.json();
      if (!redacted.presidio) throw new Error('Redaction Error!');
      setInputText('');
      console.log(redacted.presidio);
      // setRedactedText(redacted.presidio);
    } catch (error) {
      setError(error);
    }
  }

  async function handlePrompt() {}

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
      <form
        onSubmit={handleRedact}
        className="flex justify-center items-center w-full m-[35px]">
        <Prompt
          onError={setError}
          inputText={inputText}
          setInputText={setInputText}
        />
        <SelectFilterSet
          isNone={setIsRedacted}
          currentSet={currentSet}
          setCurrentSet={setCurrentSet}
          // filterSets={}
        />
        <RedactPrompt onPrompt={handlePrompt} isRedacted={isRedacted} />
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
  inputText: string;
  setInputText: (e: string) => void;
};

function Prompt({ onError, inputText, setInputText }: PromptProps) {
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

type SelectFilterSetProps = {
  isNone: (value: boolean) => void;
  // filterSets: FilterSet[] | UnsavedFilterSet[];
  // currentSet: FilterSet | UnsavedFilterSet;
  currentSet: string;
  setCurrentSet: (e: string) => void;
};

function SelectFilterSet({
  isNone,
  currentSet,
  setCurrentSet,
}: SelectFilterSetProps) {
  const navigate = useNavigate();
  if (currentSet === 'Create') {
    navigate('/filter-sets');
  }
  if (currentSet === 'None') {
    isNone(true);
  } else {
    isNone(false);
  }
  return (
    <div>
      <select
        name="filterSet"
        value={currentSet}
        onChange={(e) => setCurrentSet(e.currentTarget.value)}
        className="flex items-center text-center text-mywhite rounded-[40px] p-1 ml-1 mr-1 border-[5.5px] border-black w-[98px] min-w-[98px] max-w-[98px] text-[15px] h-[40px] bg-black select-none">
        <option className="hidden" value="">
          Filter Set
        </option>
        <option value=""></option>
        <option value="None">None</option>
        <option value="PHONE_NUMBER">Phone Number</option>
        <option value="Create">+Create Filter Set</option>
      </select>
    </div>
  );
}

type RedactPromptProps = {
  isRedacted: boolean;
  onPrompt: () => void;
};

function RedactPrompt({ isRedacted, onPrompt }: RedactPromptProps) {
  let styles = '';
  if (isRedacted) {
    styles =
      'bg-myyellow border-myyellow text-black hover:bg-green-600 hover:border-green-600 hover:text-white';
  } else {
    styles =
      'bg-mywhite border-mywhite text-black hover:bg-blue-500 hover:border-blue-500 hover:text-white';
  }
  return (
    <div>
      <button
        type={isRedacted ? 'button' : 'submit'}
        onClick={isRedacted ? onPrompt : undefined}
        className={`flex justify-center items-center text-center rounded-[40px] pt-1 pb-1 pl-2 pr-2 ml-1 mr-1 border-[5.5px] min-w-[73.55px] max-w-[73.55px] text-[15px] h-[40px] select-none
        ${styles}`}>
        {isRedacted ? 'Prompt' : 'Redact'}
      </button>
    </div>
  );
}
