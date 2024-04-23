import { useState, useRef } from 'react';
import { SelectFilterSet } from '../components/SelectFilterSet';
import { WriteBox } from '../components/WriteBox';
import { RedactOrPrompt } from '../components/RedactOrPrompt';
import { Display } from '../components/Display';
import { presidioRedaction } from '../lib/data';
import { validate } from '../lib/data';
import { ValidationError } from '../lib/errors';

export function Home() {
  const [error, setError] = useState<unknown>();
  //will implement: displayText state
  const [inputText, setInputText] = useState('');
  const [isRedacted, setIsRedacted] = useState(false);
  const [currentSet, setCurrentSet] = useState('initial');
  const displayRef = useRef<HTMLDivElement>(null);

  function adjustDisplayHeight(textareaHeight: number) {
    // 39 is initial height of textarea, this could be better handled
    textareaHeight -= 39;
    const display = displayRef.current;
    if (!display) throw new Error('Missing display!');
    display.style.height = '55vh';
    display.style.height = String(display.offsetHeight - textareaHeight) + 'px';
  }

  async function handleRedact() {
    try {
      validate(inputText, currentSet);
      const redactedText = await presidioRedaction(inputText, currentSet);
      setIsRedacted(true);
      setCurrentSet('review');
      setInputText(redactedText);
    } catch (error) {
      setError(error);
    }
  }

  async function handlePrompt() {}

  return (
    <>
      <div className="h-[50vh]" ref={displayRef}>
        <Display
          displayText={
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
          }
        />
      </div>
      <div className="flex flex-wrap justify-center items-end w-full m-[20px] max-h-[200px]">
        <WriteBox
          onError={setError}
          inputText={inputText}
          setInputText={setInputText}
          adjustDisplayHeight={adjustDisplayHeight}
        />
        <div className="flex flex-wrap justify-center">
          <SelectFilterSet
            setIsRedacted={setIsRedacted}
            currentSet={currentSet}
            setCurrentSet={setCurrentSet}
            // filterSets={}
          />
          <RedactOrPrompt
            onRedact={handleRedact}
            onPrompt={handlePrompt}
            isRedacted={isRedacted}
          />
        </div>
      </div>
      {error && (
        <h2 className="text-red-500 text-[12px]">
          {error instanceof Error || error instanceof ValidationError
            ? String(error)
            : `An unexpected error occurred: ${error}`}
        </h2>
      )}
    </>
  );
}
