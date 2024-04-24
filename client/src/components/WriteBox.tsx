import { useState, useRef, useCallback, useEffect } from 'react';

type WriteBoxProps = {
  setError: (error: unknown) => void;
  inputText: string;
  onChange: (e: string) => void;
  adjustDisplayHeight: (
    initialWriteBoxHeight: number,
    writeBoxHeight: number
  ) => void;
};

/* I named this WriteBox, because it all got very confusing referring to Prompt, Prompt button, etc in different ways */
export function WriteBox({
  setError,
  inputText,
  onChange,
  adjustDisplayHeight,
}: WriteBoxProps) {
  const maxHeight = 200;
  const initialHeight = 39;
  const [height, setHeight] = useState(initialHeight);
  const defaultScrollHeight = 61;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* This dynamically adjusts my WriteBox height as I type until 200px */
  const adjustWriteBoxHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) throw new Error('Unable to load prompter!');
    const isContentLessThanDefault =
      textarea.scrollHeight < defaultScrollHeight;
    if (!inputText || isContentLessThanDefault) {
      // If there is no text and content is less than the default height, set a one line fixed height
      textarea.style.height = initialHeight + 'px';
    } else {
      // Else set the height to the smaller of the scrollHeight and maxHeight
      const currentScrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(currentScrollHeight, maxHeight)}px`;
    }
    setHeight(textarea.offsetHeight);
  }, [inputText]);

  useEffect(() => {
    try {
      adjustWriteBoxHeight();
    } catch (error) {
      setError(error);
    }
  }, [inputText, adjustWriteBoxHeight, setError]);

  useEffect(() => {
    try {
      adjustDisplayHeight(initialHeight, height); //arguments refer to writeBox
    } catch (error) {
      setError(error);
    }
  }, [height, adjustDisplayHeight, setError]);

  return (
    <div className="mt-[15px]">
      <textarea
        ref={textareaRef}
        className="flex items-center bg-myconcrete border-[1px] border-black rounded-[40px] pt-2 pb-2 pl-6 pr-6 ml-1 mr-1 overflow-y-scroll resize-none w-[40vw] text-[15px]"
        placeholder="Select Filter Set, Write, Redact, Prompt!"
        onChange={(e) => {
          onChange(e.currentTarget.value);
        }}
        value={inputText}
      />
    </div>
  );
}
