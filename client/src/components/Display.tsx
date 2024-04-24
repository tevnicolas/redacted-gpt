import { useEffect, useRef } from 'react';
import { Message } from '../lib/messageData';

type DisplayProps = {
  mailbox: Message[];
  isLoading: boolean;
};
/** Display shows user prompted (post-redaction, validated) messages and AI response messages, as well as temporary loading messages and confirmations; It will show the entirety of a single session's conversation */
export function Display({ mailbox, isLoading }: DisplayProps) {
  const displayInnerRef = useRef<HTMLDivElement>(null);

  // Auto scrolls to bottom of the thread with every new message
  useEffect(() => {
    if (!displayInnerRef.current) return;
    displayInnerRef.current.scrollTop = displayInnerRef.current.scrollHeight;
  }, [mailbox]);

  return (
    <div className="flex w-[70vw] max-w-[800px] h-[inherit] bg-mygrey rounded-[20px]">
      <div className="m-10 text-left overflow-y-scroll" ref={displayInnerRef}>
        <ul>
          {mailbox.map((message, index) => (
            <li
              key={message.id}
              className={`text-mywhite text-[18px] ${
                index !== mailbox.length - 1 ? 'mb-8' : ''
              }`}>
              {message.text}
            </li>
          ))}
          {isLoading && (
            <li className="text-mywhite text-[18px] mt-8 animate-fadeIn">
              Loading...
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
