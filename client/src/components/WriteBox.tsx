import { useState, useRef, useCallback, useEffect } from 'react';

type WriteBoxProps = {
  onError: (error: unknown) => void;
  inputText: string;
  setInputText: (e: string) => void;
  adjustDisplayHeight: (height: number) => void;
};

/* I named this WriteBox, because it all got very confusing referring to Prompt, Prompt button, etc in different ways */
export function WriteBox({
  onError,
  inputText,
  setInputText,
  adjustDisplayHeight,
}: WriteBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState(39);
  const maxHeight = 200;

  /* This dynamically adjusts my WriteBox height as I type until 200px */
  const adjustWriteBoxHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) throw new Error('Unable to load prompter!');
    textarea.style.height = '39px'; // Set to the default height for safety
    const isContentLessThanDefault = textarea.scrollHeight < 61; // The observed default scrollHeight
    if (!inputText || isContentLessThanDefault) {
      // If there is no text and content is less than the default height, set a one line fixed height
      textarea.style.height = '39px';
    } else {
      const currentScrollHeight = textarea.scrollHeight;
      // Set the height to the smaller of the scrollHeight and maxHeight
      textarea.style.height = `${Math.min(currentScrollHeight, maxHeight)}px`;
    }
    setTextareaHeight(textarea.offsetHeight);
  }, [inputText]);

  useEffect(() => {
    try {
      adjustWriteBoxHeight();
    } catch (error) {
      onError(error);
    }
  }, [inputText, adjustWriteBoxHeight, onError]);

  useEffect(() => {
    try {
      adjustDisplayHeight(textareaHeight);
    } catch (error) {
      onError(error);
    }
  }, [textareaHeight, adjustDisplayHeight, onError]);

  return (
    <div className="mt-[15px]">
      <textarea
        ref={textareaRef}
        className="flex items-center bg-myconcrete border-[1px] border-black rounded-[40px] pt-2 pb-2 pl-6 pr-6 ml-1 mr-1 overflow-y-scroll resize-none w-[40vw] text-[15px] h-[39px]"
        placeholder="Select Filter Set, Write, Redact, Prompt!"
        onChange={(e) => {
          setInputText(e.currentTarget.value);
        }}
        value={inputText}
      />
    </div>
  );
}
