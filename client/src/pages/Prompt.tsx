import { useEffect, useState, useRef } from 'react';

export function Prompt() {
  const [display, setDisplay] = useState(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  );
  if (!display) setDisplay('hello'); // throwaway line, I just need to commit
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxHeight = 200;

  useEffect(() => {
    function adjustHeight() {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = '40px'; // Set to the default height
        const isContentLessThanDefault = textarea.scrollHeight <= 64; // Adjust as per the observed default scrollHeight
        if (!text || isContentLessThanDefault) {
          // If there is no text or content is less than the default height, set a small fixed height
          textarea.style.height = '40px';
        } else {
          const currentScrollHeight = textarea.scrollHeight;
          // Set the height to the larger of the scrollHeight and maxHeight
          textarea.style.height = `${Math.min(
            currentScrollHeight,
            maxHeight
          )}px`;
        }
      }
    }
    adjustHeight();
  }, [text]);

  return (
    <div className="flex flex-wrap justify-center w-[100%] mt-14 mb-14">
      <div className="flex w-[70vw] max-w-[800px] h-[50vh] bg-mygrey rounded-[20px]">
        <div className="m-10 text-left overflow-y-scroll">
          <p className="text-mywhite text-[18px]">{display}</p>
        </div>
      </div>
      <form className="flex justify-center w-full m-[35px]">
        <div>
          <textarea
            ref={textareaRef}
            className="flex items-center bg-myconcrete border-[1px] border-black rounded-[40px] pt-2 pb-2 pl-6 pr-6 overflow-y-scroll resize-none w-[40vw]"
            placeholder="Select filter set and message Redacted GPT"
            onChange={(e) => {
              setText(e.currentTarget.value);
            }}
            rows={1}
            value={text}
            required
          />
        </div>
        <div></div>
        <div></div>
      </form>
    </div>
  );
}
