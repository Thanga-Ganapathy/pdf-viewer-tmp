import { useState, useEffect, useCallback } from 'react';

// Custom hook for ResizeObserver
const useResizeObserver = (ref) => {
  const [rect, setRect] = useState({ width: 0, height: 0 });

  const handleResize = useCallback(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setRect({ width, height });
    }
  }, [ref]);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(handleResize);
    observer.observe(ref.current);

    // Call the resize handler once to set initial size
    handleResize();

    // Cleanup observer on unmount or ref change
    return () => {
      observer.disconnect();
    };
  }, [ref, handleResize]);

  return rect;
};

export default useResizeObserver;
