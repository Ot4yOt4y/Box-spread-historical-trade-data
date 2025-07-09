import React from "react";
import FAQItem from "./FAQcomponent";

const FAQ = () => {
  const faqs = [
    {
      question: "How does the data on the graph help investors?",
      answer: (
        <>
          <p className="mb-4">
            The graph provides historical trade data for complex options strategy box spread on the EURO STOXX 50 (OESX) and Swiss Market Index (OSMI). Brokers typically don't offer past execution data for such multi-leg orders, leaving investors without a clear view of where the market has been and forcing them to estimate fair pricing.
          </p>
          <p className="mb-4">
            The data visualized on the graph is extracted from EUREX T7 Entry Service .csv files, which provide past trade data for off-order-book activity. While this isn't the same as official exchange reported trade data - which is expensive and often out of reach for individual investors, it offers a reliable and cost-effective alternative for gauging where the market is at.
          </p>
        </>
      ),
    },
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
        "The box spreads trade data on the graph is updated daily at 12 AM (CET) for the previous trading day.",
    },
    {
      question: "How is the interest rate of a box spread calculated?",
      answer:
        "The box spread cost is the total premium paid (or received) for all four legs. This is then subtracted from the known payoff cost (difference in strikes) and annualized to result in yearly interest rate.",
    },
        {
      question: "Why are the spreads so wide on trades shown in the graph?",
      answer:
        "The trades displayed are from off-order-book executions, such as negotiated block trades or complex multi-leg strategies executed directly through EUREX. Importantly, off-order-book trades generally align with where the market stands on the order book. The wider spreads typically result from how the trades are packaged and executed.",
    },
  ];

  return (
    <section className="py-12">
      <div className="w-[50%] mx-auto px-4">
        <h2 className="text-xl font-bold text-center text-white mb-16 mt-20">
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
