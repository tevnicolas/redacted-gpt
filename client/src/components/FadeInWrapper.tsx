import React, { useEffect, useRef, memo } from 'react';

type FadeInWrapperProps = {
  children: React.ReactNode;
};

export const FadeInWrapper = memo(({ children }: FadeInWrapperProps) => {
  // State to track whether to apply the animation
  // const [shouldAnimate, setShouldAnimate] = useState(true);
  const shouldAnimate = useRef<boolean>(true);
  // State to store the timeout ID
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!shouldAnimate) return;
    const id = setTimeout(() => {
      shouldAnimate.current = false;
    }, 500); // assume this is your animation duration
    return () => clearTimeout(id);
  }, [shouldAnimate]);

  useEffect(() => {
    // Clear any existing timeout to ensure clean animation restart
    clearTimeout(timeoutIdRef.current);
    // Schedule to turn off the animation
    timeoutIdRef.current = setTimeout(() => {
      shouldAnimate.current = true; // This ensures we turn off the animation
    }, 500); // Duration matches your CSS animation
    // Cleanup function to clear the timeout if the component unmounts or the path changes again
    return () => {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = undefined;
    };
  }, [children]); // React only to changes in currentPath

  return (
    <div
      className={`${
        shouldAnimate ? 'animate-fadeIn' : ''
      } flex flex-wrap justify-center w-[100%] mt-14 mb-14 z-0`}>
      {children}
    </div>
  );
});

// Effect to handle animation logic
// useEffect(() => {
//   if (!shouldAnimate) return;
//   const id = setTimeout(() => {
//     setShouldAnimate(false);
//   }, 1000); // assume this is your animation duration
//   return () => clearTimeout(id);
// }, [shouldAnimate]);

// // Effect to manage timing between animations
// useEffect(() => {
//   // Always clear any existing timeout, safe operation even if undefined
//   clearTimeout(timeoutIdRef.current);
//   // Set a new timeout to enable animation
//   timeoutIdRef.current = setTimeout(() => {
//     setShouldAnimate(true);
//   }, 1000); // Sets a minimum delay of 1 second between animations
//   // Cleanup function to clear the timeout when the component unmounts or re-renders
//   return () => {
//     clearTimeout(timeoutIdRef.current);
//     timeoutIdRef.current = undefined;
//   };
// }, [children]);
