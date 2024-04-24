import { useState, useRef, useEffect } from 'react';
import { SelectFilterSet } from '../components/SelectFilterSet';
import { WriteBox } from '../components/WriteBox';
import { RedactOrPrompt } from '../components/RedactOrPrompt';
import { Display } from '../components/Display';
import { presidioRedaction, promptChatGPT } from '../lib/apiData';
import { validateSubmission } from '../lib/validation';
import { ValidationError } from '../lib/validation';
import { Message } from '../lib/messageData';

export function Home() {
  const [error, setError] = useState<unknown>();
  const [inputText, setInputText] = useState('');
  const [isRedacted, setIsRedacted] = useState(false);
  // 'Set' is always referring to Filter Set selection value
  const [currentSet, setCurrentSet] = useState('initial');
  const lastSetRef = useRef<string>('initial'); // using this ref like state
  const displayContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // messages retrieves from session storage on mount
  const [messages, setMessages] = useState<Message[]>(() => {
    const storedMessages = sessionStorage.getItem('chatMessages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  });

  // If messages changes, session storage is updated
  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // This effect clears Val error only if input or select is updated
  useEffect(() => {
    if (error instanceof ValidationError) {
      setError(undefined);
    }
    // Disabling, as the reset is not dependent on error itself, just user input
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText, currentSet]);

  function adjustDisplayHeight(
    initialWriteBoxHeight: number,
    writeBoxHeight: number // it grows
  ) {
    writeBoxHeight -= initialWriteBoxHeight;
    const display = displayContainerRef.current;
    if (!display) throw new Error('Missing display!');
    display.style.height = '55vh';
    display.style.height = String(display.offsetHeight - writeBoxHeight) + 'px';
  }

  async function handleRedact() {
    try {
      validateSubmission(inputText, currentSet);
      setIsLoading(true);
      const redactedText = await presidioRedaction(inputText, currentSet);
      setIsRedacted(true);
      lastSetRef.current = currentSet;
      setCurrentSet('review');
      setInputText(redactedText);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePrompt() {
    try {
      validateSubmission(inputText);
      setIsLoading(true);
      // Generates new id by last message's id, ++, If no messages-> id is 1
      const newUserMessage: Message = {
        id: messages.length ? messages[messages.length - 1].id + 1 : 1,
        text: inputText,
        sender: 'user',
      };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);

      const aiAnalysisText = await promptChatGPT(inputText);
      // when user did not redact, select will still revert appropriately
      if (currentSet !== 'review') {
        lastSetRef.current = currentSet;
      }
      // If any filter set except 'none' was last set, show redact option again
      if (lastSetRef.current !== 'none') {
        setIsRedacted(false);
      }
      setCurrentSet(lastSetRef.current); // revert

      const newGptMessage: Message = {
        id: newUserMessage.id++,
        text: aiAnalysisText,
        sender: 'ai',
      };

      setMessages((prevMessages) => [...prevMessages, newGptMessage]);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="h-[50vh]" ref={displayContainerRef}>
        <Display isLoading={isLoading} mailbox={messages} />
      </div>
      <div className="flex flex-wrap justify-center items-end w-full m-[20px] max-h-[200px]">
        <WriteBox
          setError={setError}
          inputText={inputText}
          onChange={setInputText}
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
