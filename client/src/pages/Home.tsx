import { useState, useRef, useEffect } from 'react';
import { SelectFilterSet } from '../components/SelectFilterSet';
import { WriteBox } from '../components/WriteBox';
import { RedactOrPrompt } from '../components/RedactOrPrompt';
import { Display } from '../components/Display';
import { presidioRedaction, promptChatGPT } from '../lib/data';
import { validateSubmission } from '../lib/data';
import { ValidationError } from '../lib/errors';

export function Home() {
  const [error, setError] = useState<unknown>();
  const [inputText, setInputText] = useState('');
  const [isRedacted, setIsRedacted] = useState(false);
  const [currentSet, setCurrentSet] = useState('initial');
  const lastSetRef = useRef<string>('initial');
  const [displayText, setDisplayText] = useState(
    'Hello! Welcome to RedactedGPT.'
  );
  const displayBoxRef = useRef<HTMLDivElement>(null);
  // const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error instanceof ValidationError) {
      setError(undefined);
    }
    // Disabling dependency check because this effect should clear Val error only if input or select is made, not if there is an error of any kind
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText, currentSet]);

  function adjustDisplayHeight(textareaHeight: number) {
    // 39 is initial height of textarea, this could be better handled
    textareaHeight -= 39;
    const display = displayBoxRef.current;
    if (!display) throw new Error('Missing display!');
    display.style.height = '55vh';
    display.style.height = String(display.offsetHeight - textareaHeight) + 'px';
  }

  async function handleRedact() {
    try {
      validateSubmission(inputText, currentSet);
      const redactedText = await presidioRedaction(inputText, currentSet);
      setIsRedacted(true);
      lastSetRef.current = currentSet;
      setCurrentSet('review');
      setInputText(redactedText);
    } catch (error) {
      setError(error);
    }
  }

  async function handlePrompt() {
    try {
      validateSubmission(inputText);
      const aiAnalysisText = await promptChatGPT(inputText);
      // when user did not redact, select will still revert appropriately
      if (currentSet !== 'review') {
        lastSetRef.current = currentSet;
      }
      //If any filter set except 'None' was last set, show redact option again
      if (lastSetRef.current !== 'none') {
        setIsRedacted(false);
      }
      setCurrentSet(lastSetRef.current); // revert
      setDisplayText(aiAnalysisText);
    } catch (error) {
      setError(error);
    }
  }

  return (
    <>
      <div className="h-[50vh]" ref={displayBoxRef}>
        <Display displayText={displayText} />
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
