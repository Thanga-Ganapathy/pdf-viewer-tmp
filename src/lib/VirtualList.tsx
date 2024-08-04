import React, { useState, useRef, useCallback, useEffect } from "react";
import debounce from "lodash/debounce"; // Import debounce function from Lodash

const VirtualList = ({ itemCount, itemHeight, renderItem, overscan = 5 }) => {
  const [visibleIndices, setVisibleIndices] = useState(new Set());
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  // Calculate visible items based on scroll position
  const updateVisibleIndices = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    // Calculate start and end indices based on scroll position
    const startIndex = Math.floor(containerTop / itemHeight);
    const endIndex = Math.floor(containerBottom / itemHeight);

    // Calculate initial visible indices
    const newVisibleIndices = new Set();
    for (let index = startIndex; index <= endIndex; index++) {
      if (index >= 0 && index < itemCount) {
        newVisibleIndices.add(index);
      }
    }

    // Extend indices with overscan
    const extendedIndices = new Set(newVisibleIndices);
    newVisibleIndices.forEach((index) => {
      for (let i = 1; i <= overscan; i++) {
        if (index - i >= 0) extendedIndices.add(index - i);
        if (index + i < itemCount) extendedIndices.add(index + i);
      }
    });

    setVisibleIndices(extendedIndices);
  }, [itemHeight, itemCount, overscan]);

  // Debounce the updateVisibleIndices function
  const debouncedUpdateVisibleIndices = useCallback(
    debounce(updateVisibleIndices, 10),
    [updateVisibleIndices]
  );

  // Attach scroll event listener
  useEffect(() => {
    const container = containerRef.current;

    container.addEventListener("scroll", debouncedUpdateVisibleIndices);

    // Initial visibility check
    updateVisibleIndices();

    // Cleanup on unmount
    return () => {
      container.removeEventListener("scroll", debouncedUpdateVisibleIndices);
      // Cancel any pending debounced calls
      debouncedUpdateVisibleIndices.cancel();
    };
  }, [debouncedUpdateVisibleIndices, updateVisibleIndices]);

  // Render the virtualized list
  return (
    <div
      ref={containerRef}
      style={{
        height: "100%",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <div
        style={{
          height: itemCount * itemHeight,
          position: "relative",
        }}
      >
        {Array.from(visibleIndices).map((index) => (
          <div
            key={index}
            ref={(el) => (itemRefs.current[index] = el)}
            style={{
              position: "absolute",
              top: index * itemHeight,
              height: itemHeight,
              width: "100%",
            }}
          >
            {renderItem(index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualList;
