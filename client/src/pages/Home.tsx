import { useState, useRef } from 'react';
import { SelectFilterSet } from '../components/SelectFilterSet';
import { WriteBox } from '../components/WriteBox';
import { RedactOrPrompt } from '../components/RedactOrPrompt';
import { Display } from '../components/Display';
// import { FilterSet, UnsavedFilterSet } from '../lib/data';

export function Home() {
  const [error, setError] = useState<unknown>();
  //displayText state
  const [inputText, setInputText] = useState('');
  const [isRedacted, setIsRedacted] = useState(false);
  const [currentSet, setCurrentSet] = useState('');
  // const [redactedText, setRedactedText] = useState('');
  const displayRef = useRef<HTMLDivElement>(null);

  function adjustDisplayHeight(textareaHeight: number) {
    textareaHeight -= 39; //0 additional height
    const display = displayRef.current;
    if (!display) throw new Error('Missing display!');
    display.style.height = '55vh';
    display.style.height = String(display.offsetHeight - textareaHeight) + 'px';
  }

  async function handleRedact() {
    try {
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
            isNone={setIsRedacted}
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
    </>
  );
}
