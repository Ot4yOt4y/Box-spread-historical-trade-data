import React, { useState, useRef, useEffect } from "react";

const FAQItem = ({ question, answer }) => {
  const [expanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (expanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [expanded]);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="w-full text-left flex justify-between items-center focus:outline-none"
        onClick={() => setIsExpanded(!expanded)}
      >
        <span className="text-lg font-medium text-white">{question}</span>
        <span
          className={`text-2xl font-bold text-white transform transition-transform duration-300 ${
            expanded ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        ref={contentRef}
        style={{
          maxHeight: `${height}px`,
        }}
        className="transition-all duration-500 ease-in-out overflow-hidden text-white"
      >
        <div className="pb-2 pt-2">{answer}</div>
      </div>
    </div>
  );
};

export default FAQItem;

