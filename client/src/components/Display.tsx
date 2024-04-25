import { useEffect, useRef, Fragment } from 'react';
import { Message } from '../lib/messageData';

type DisplayProps = {
  mailbox: Message[];
  isLoading: boolean;
  isRedacted: boolean;
};
/** Display shows user prompted (post-redaction, validated) messages and AI response messages, as well as temporary loading messages and confirmations; It will show the entirety of a single session's conversation */
export function Display({ mailbox, isLoading, isRedacted }: DisplayProps) {
  const displayInnerRef = useRef<HTMLUListElement>(null);
  // const displayOuterRef = useRef<HTMLDivElement>(null);
  // Auto scrolls to bottom of the thread with every new message or if display changes height
  useEffect(() => {
    if (!displayInnerRef.current) return;
    displayInnerRef.current.scrollTop = displayInnerRef.current.scrollHeight;
  }, [mailbox]);

  return (
    <div className="flex w-[70vw] max-w-[800px] h-[inherit] bg-mygrey rounded-[20px]">
      <div className="flex items-end m-10 pr-[20px] text-left w-full overflow-y-scroll">
        <ul className="max-h-[438px] overflow-y-scroll" ref={displayInnerRef}>
          {mailbox.map((message, index) => (
            <ListItem
              key={message.id}
              message={message}
              className={index !== mailbox.length - 1 ? 'mb-8' : ''}
            />
          ))}
          {isLoading && (
            <ListItem
              key={'loading'}
              isRedacted={isRedacted}
              className={mailbox.length ? 'mt-8' : ''}
            />
          )}
        </ul>
      </div>
    </div>
  );
}

type ListItemProps = {
  message?: Message;
  className?: string;
  isRedacted?: boolean;
};

function ListItem({ message, className, isRedacted }: ListItemProps) {
  return (
    <li
      className={`flex items-start text-mywhite text-[18px] animate-fadeIn ${className}`}>
      <Text
        sender={message?.sender ?? (isRedacted ? 'ai' : 'security')}
        text={message?.text ?? 'Loading'}
      />
    </li>
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
          sender === 'user'
            ? 'bg-myyellow'
            : sender === 'security'
            ? 'bg-black'
            : 'bg-myconcrete'
        }`}
      />
      <div>
        <span className="inline font-bold">
          {sender === 'user'
            ? 'You'
            : sender === 'security'
            ? 'Security'
            : 'RedactedGPT'}
        </span>
        <br />
        <span
          className={
            text === 'Loading'
              ? "animate-ellipsis after:content-[''] after:inline after:animate-ellipsis"
              : ''
          }>
          {textWithLineBreaks}
        </span>
      </div>
    </>
  );
}
