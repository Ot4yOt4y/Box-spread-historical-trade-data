import React, { useState } from "react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center focus:outline-none"
      >
        <span className="text-lg font-medium text-white">{question}</span>
        <span className="text-2xl font-bold text-white">
          {isOpen ? "-" : "+"}
        </span>
      </button>
      {isOpen && <div className="mt-2 text-white">{answer}</div>}
    </div>
  );
};

export default FAQItem;
