import React from "react";
import FAQItem from "./FAQcomponent";

const FAQ = () => {
  const faqs = [
    {
      question: "What is a box spread?",
      answer:
        "A box spread is an options trading strategy that creates a risk-free position using a combination of calls and puts. It effectively simulates a loan with fixed interest rate.",
    },
    {
      question: "Why do traders use box spreads?",
      answer:
        "Traders use box spreads to access synthetic borrowing or lending with locking in risk-free interest rates."
    },
    {
      question: "Where does the trade data on this site come from?",
      answer: (
        <>
          The trade data is sourced from EUREX{" "}
          <a href="https://www.eurex.com/ex-en/data/trading-files/t7-entry-service-parameters" className="text-blue-400 underline hover:text-blue-300">T7 Entry Service parameters</a>
          .
        </>
      ),
    },
    {
      question: "How often is the data updated?",
      answer:
        "",
    },
    {
      question: "How is the interest rate of a box spread calculated?",
      answer:
        "The box spread cost is the total premium paid (or received) for all four legs. This is then subtracted from the known payoff cost (difference in strikes) and annualized to result in yearly interest rate.",
    },
        {
      question: "Why are the spreads so wide on trades shown in the graph?",
      answer:
        "The trades displayed are from off-order-book executions, such as negotiated block trades or complex multi-leg strategies executed directly through EUREX. Importantly, off-order-book trades generally align with where the market stands on the order book. The wider-looking spreads typically result from how the trades are packaged and executed, not necessarily from market inefficiency.",
    },
    {
      question: "Is this website offering financial advice?",
      answer:
        "No. All content on this site is for informational and educational purposes only.",
    },
  ];

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-white mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 mb-24">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
