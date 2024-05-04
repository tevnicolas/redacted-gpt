import { useRef, useCallback, useEffect } from 'react';

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
  const defaultScrollHeight = 61;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* This dynamically adjusts my WriteBox height as I type until 200px */
  const adjustWriteBoxHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) throw new Error('Unable to load prompter!');

    textarea.style.height = 'auto';
    let isContentLessThanDefault = textarea.scrollHeight < defaultScrollHeight;
    if (!inputText || isContentLessThanDefault) {
      // sets to initial height if no text or if text is deleted
      textarea.style.height = initialHeight + 'px';
    } else {
      // Else set the height to the smaller of the scrollHeight and maxHeight
      const currentScrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(currentScrollHeight, maxHeight)}px`;
      /* redefining var with same exp is necessary here because scrollHeight changes when you reset textarea.style.height in the code above */
      isContentLessThanDefault = textarea.scrollHeight < defaultScrollHeight;
      if (isContentLessThanDefault) {
        textarea.style.height = initialHeight + 'px';
      }
    }
    //adjusts display accordingly
    adjustDisplayHeight(initialHeight, textarea.offsetHeight);
  }, [inputText, adjustDisplayHeight]);

  useEffect(() => {
    try {
      adjustWriteBoxHeight();
    } catch (error) {
      setError(error);
    }
  }, [inputText, adjustWriteBoxHeight, setError]);

  return (
    <div className="mt-[15px]">
      <textarea
        ref={textareaRef}
        className="custom-textarea flex items-center bg-myconcrete border-[1px] border-black rounded-[40px] pt-2 pb-2 pl-6 pr-6 ml-1 mr-1 overflow-y-scroll resize-none text-[15px] max-w-[500px] w-[60vw] sm:w-[60vw] md:w-[60vw] bw-860:w-[40vw] bw-1050:w-[40vw]"
        placeholder="Select Filter Set, Write, Redact, Prompt!"
        onChange={(e) => {
          onChange(e.currentTarget.value);
        }}
        value={inputText}
      />
    </div>
  );
}
