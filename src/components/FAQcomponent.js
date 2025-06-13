import React, { useState } from "react";

const FAQItem = ({ question, answer }) => {
  return (
    <div className="border-b border-gray-200 py-4 group">
      <div className="w-full text-left flex justify-between items-center">
        <span className="text-lg font-medium text-white">{question}</span>
        <span className="text-2xl font-bold text-white group-hover:rotate-45 transition-transform duration-200">
          +
        </span>
      </div>
      <div
        className="mt-2 text-white max-h-0 opacity-0 overflow-hidden transition-all duration-300 ease-in-out group-hover:max-h-96 group-hover:opacity-100"
      >
        <div className="pb-2">{answer}</div>
      </div>
    </div>
  );
};

export default FAQItem;

