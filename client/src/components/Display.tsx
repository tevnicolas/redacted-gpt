import { useEffect, useRef, Fragment } from 'react';
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
      <div
        className="m-10 pr-[20px] text-left overflow-y-scroll w-full"
        ref={displayInnerRef}>
        <ul>
          {mailbox.map((message, index) => (
            <li
              key={message.id}
              className={`flex items-start text-mywhite text-[18px] animate-fadeIn ${
                index !== mailbox.length - 1 ? 'mb-8' : ''
              }`}>
              <Text sender={message.sender} text={message.text} />
            </li>
          ))}
          {isLoading && (
            <li
              key="loading"
              className="flex items-start text-mywhite text-[18px] mt-8 animate-fadeIn">
              <Text sender={'loading'} text={'Loading'} />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

type TextProps = {
  sender: string;
  text: string;
};

function Text({ sender, text }: TextProps) {
  const textWithLineBreaks = text.split('\n').map((lines, index) => (
    <Fragment key={index}>
      {lines}
      {index !== text.split('\n').length - 1 && <br />}
    </Fragment>
  ));
  return (
    <>
      <div
        className={`rounded-[5px] min-w-[10px] min-h-[10px] mr-[10px] mt-[9px] ${
          sender === 'user' ? 'bg-myyellow' : 'bg-myconcrete'
        }`}
      />
      <div>
        <span className="inline font-bold">
          {sender === 'user' ? 'You' : 'RedactedGPT'}
        </span>
        <br />
        <span
          className={
            sender === 'loading'
              ? "animate-ellipsis after:content-[''] after:inline after:animate-ellipsis"
              : ''
          }>
          {textWithLineBreaks}
        </span>
      </div>
    </>
  );
}
