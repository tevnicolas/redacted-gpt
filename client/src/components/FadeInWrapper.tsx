import React, { useEffect, useRef, memo } from 'react';

type FadeInWrapperProps = {
  children: React.ReactNode;
  className: string;
};
/* This component fades in things. Memoized so that it doesn't rerender when parent rerenders which causes the fade in to fail */
export const FadeInWrapper = memo(
  ({ children, className }: FadeInWrapperProps) => {
    //useRefs necessary as state contradicts fade in effect when Header rerenders
    const shouldAnimate = useRef<boolean>(true);
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>();

    /* These useEffects make my head hurt, all logic is out the window here but it sure does work. Do not combine the useEffects. Trust me, I've tried. */

    useEffect(() => {
      if (!shouldAnimate) return;
      const id = setTimeout(() => {
        shouldAnimate.current = false;
      }, 500); // animation duration as set in Tailwind config
      return () => clearTimeout(id);
    }, [shouldAnimate]);

    useEffect(() => {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = setTimeout(() => {
        shouldAnimate.current = true;
      }, 500); // animation duration as set in Tailwind config
      return () => {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = undefined;
      };
    }, [children]);

    return (
      <div className={`${shouldAnimate ? 'animate-fadeIn' : ''} ${className}`}>
        {children}
      </div>
    );
  }
);
