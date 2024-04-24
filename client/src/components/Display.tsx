import { useEffect, useRef } from 'react';
import { Message } from '../lib/messageData';

type DisplayProps = {
  mailbox: Message[];
};
/* The display box where prompted text (post-redaction submitted) and AI responses, conversation will occur*/
export function Display({ mailbox }: DisplayProps) {
  const displayInnerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Scroll to the bottom of the display when mailbox changes
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
        </ul>
      </div>
    </div>
  );
}
