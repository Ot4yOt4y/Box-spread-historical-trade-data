import React, { useState } from "react";
import InterestOverTimeChart from "./components/chart";
import FAQ from "./components/FAQ";

function App() {
  const [activeTab, setActiveTab] = useState("ESTX50 (OESX)");

  let endpoint;
    if (activeTab === "ESTX50 (OESX)") {
      endpoint = "https://box-spread-trades-history.onrender.com/api/estx50";
    } else {
      endpoint = "https://box-spread-trades-history.onrender.com/api/smi";
    }

  const scrollToFAQ = () => {
    const faqSection = document.getElementById("faq-section");
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToMain = () => {
    const chartSection = document.getElementById("main-content");
    if (chartSection) {
      chartSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[url(/public/background.jpeg)] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="flex-1 shadow-lg">
        <div
          className="bg-[#00142c] bg-opacity-80"
          style={{
            backgroundImage:
              'linear-gradient(to right, transparent 0%, #00142c 40%, #00142c 60%, transparent 100%)'
          }}
        >
          <header className="fixed top-0 left-0 w-full z-50 pt-8 pl-8 pr-8 pb-8 backdrop-blur-3xl bg-transparent border-b border-gray-400 border-opacity-30">
              <div className="container mx-auto flex items-center justify-center space-x-[0px]">
                <nav>
                  <ul className="flex divide-x divide-gray-400">
                    <h1 className="text-xl font-[DM Sans] px-28">
                      <button
                        onClick={() => {
                          setActiveTab("ESTX50 (OESX)");
                          scrollToMain();
                        }}
                        className={`title-hover ${
                          activeTab === "ESTX50 (OESX)"
                            ? "underline underline-offset-[12px] decoration-[0.15rem] text-blue-100"
                            : "text-white"
                        }`}
                      >
                        EURO STOXX 50
                      </button>
                    </h1>
                    <h1 className="text-xl font-[DM Sans] px-28">
                      <button
                        onClick={() => {
                          setActiveTab("SMI (OSMI)");
                          scrollToMain();
                        }}
                        className={`title-hover ${
                          activeTab === "SMI (OSMI)"
                            ? "underline underline-offset-[12px] decoration-[0.15rem] text-blue-100"
                            : "text-white"
                        }`}
                      >
                        Swiss Market Index
                      </button>
                    </h1>
                    <h1 className="text-xl font-[DM Sans] px-28 mr-24">
                      <button
                        onClick={() => {
                          scrollToFAQ();
                        }}
                        className={`title-hover ${
                          activeTab === "FAQ"
                            ? "underline underline-offset-[12px] decoration-[0.15rem] text-blue-100"
                            : "text-white"
                        }`}
                      >
                        FAQ
                      </button>
                    </h1>
                  </ul>
                </nav>
            </div>
          </header>

          <main id="main-content" className="pt-[120px] pb-24">
            <InterestOverTimeChart endpoint={endpoint} instrument={activeTab} />
          </main>
        </div>
        <div
          className="bg-[#011121] bg-opacity-80"
          style={{
            backgroundImage:
              'linear-gradient(to right, transparent 0%, #011121 40%, #011121 60%, transparent 100%)'
          }}
        >
          <section id="faq-section" className="scroll-mt-8">
            <FAQ />
          </section>
        </div>
        <div
          className="bg-[#011121] bg-opacity-80"
          style={{
            backgroundImage:
              'linear-gradient(to right, transparent 0%, #011121 40%, #011121 60%, transparent 100%)'
          }}
        >
        <footer className="text-center text-xs text-gray-400 pt-4 pb-4 backdrop-blur-3xl bg-transparent border-t border-gray-400 border-opacity-30">
          <div className="flex items-center justify-center space-x-1">
            <svg
              className="w-4 h-4 pr-1 fill-current text-gray-400"
              viewBox="0 0 24 24"
            >
              <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.2.8-.5v-1.7c-3.2.7-3.9-1.5-3.9-1.5-.6-1.4-1.5-1.7-1.5-1.7-1.2-.8.1-.8.1-.8 1.3.1 2 .9 2 .9 1.2 2.1 3.1 1.5 3.8 1.1.1-.9.5-1.5.9-1.9-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.1 0 4.6-2.8 5.6-5.4 5.9.5.5 1 1.3 1 2.6v3.8c0 .3.2.6.8.5A10.5 10.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5z" />
            </svg>
            <a
              href="https://github.com/Ot4yOt4y/Box-spread-trades-history"
              className="hover:underline"
            >
              https://github.com/Ot4yOt4y/Box-spread-trades-history
            </a>
          </div>
        </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
