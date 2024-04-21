import { useEffect, useState } from 'react';

export function FadeInWrapper({ children }) {
  // State to track whether to apply the animation
  const [shouldAnimate, setShouldAnimate] = useState(true);
  // State to store the timeout ID
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If there's an existing timeout, clear it
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Only apply the animation if shouldAnimate is true
    if (shouldAnimate) {
      // Reset shouldAnimate after the animation is complete
      const id = setTimeout(() => {
        setShouldAnimate(false);
      }, 1000); // Animation duration

      // Store the timeout ID so it can be cleared if the component re-renders within a second
      setTimeoutId(id);
    }

    // Cleanup function to clear the timeout when the component unmounts or re-renders
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [children, shouldAnimate, timeoutId]);

  return (
    <div
      className={`${
        shouldAnimate ? 'animate-fadeIn' : ''
      } flex flex-wrap justify-center w-[100%] mt-14 mb-14 z-0`}>
      {children}
    </div>
  );
}
