import React from "react";
import FAQItem from "./FAQcomponent";

const FAQ = () => {
  const faqs = [
    {
      question: "What is a box spread?",
      answer:
        "A box spread is an options trading strategy that creates a risk-free position using a combination of calls and puts. It effectively simulates a loan with fixed payoffs.",
    },
    {
      question: "What is a box spread?",
      answer:
        "A box spread is an options trading strategy that creates a risk-free position using a combination of calls and puts. It effectively simulates a loan with fixed payoffs.",
    },
        {
      question: "What is a box spread?",
      answer:
        "A box spread is an options trading strategy that creates a risk-free position using a combination of calls and puts. It effectively simulates a loan with fixed payoffs.",
    },
    {
      question: "What is a box spread?",
      answer:
        "A box spread is an options trading strategy that creates a risk-free position using a combination of calls and puts. It effectively simulates a loan with fixed payoffs.",
    },
        {
      question: "What is a box spread?",
      answer:
        "A box spread is an options trading strategy that creates a risk-free position using a combination of calls and puts. It effectively simulates a loan with fixed payoffs.",
    },
    {
      question: "What is a box spread?",
      answer:
        "A box spread is an options trading strategy that creates a risk-free position using a combination of calls and puts. It effectively simulates a loan with fixed payoffs.",
    },
        {
      question: "What is a box spread?",
      answer:
        "A box spread is an options trading strategy that creates a risk-free position using a combination of calls and puts. It effectively simulates a loan with fixed payoffs.",
    },
    {
      question: "What is a box spread?",
      answer:
        "A box spread is an options trading strategy that creates a risk-free position using a combination of calls and puts. It effectively simulates a loan with fixed payoffs.",
    },
        {
      question: "What is a box spread?",
      answer:
        "A box spread is an options trading strategy that creates a risk-free position using a combination of calls and puts. It effectively simulates a loan with fixed payoffs.",
    },
    {
      question: "What is a box spread?",
      answer:
        "A box spread is an options trading strategy that creates a risk-free position using a combination of calls and puts. It effectively simulates a loan with fixed payoffs.",
    },
        {
      question: "What is a box spread?",
      answer:
        "A box spread is an options trading strategy that creates a risk-free position using a combination of calls and puts. It effectively simulates a loan with fixed payoffs.",
    },
    {
      question: "What is a box spread?",
      answer:
        "A box spread is an options trading strategy that creates a risk-free position using a combination of calls and puts. It effectively simulates a loan with fixed payoffs.",
    },
  ];

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-white mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
