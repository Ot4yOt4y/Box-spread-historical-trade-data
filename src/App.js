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
          className="bg-[#010b1b] bg-opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(to right, transparent 0%, #010b1b 35%, #010b1b 65%, transparent 100%)'
          }}
        >
          <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
            <div className="w-[80%] mx-auto border-b border-gray-400 border-opacity-30 backdrop-blur-3xl">
              <nav>
                <ul className="w-[50%] flex flex-col sm:flex-row justify-between items-center mx-auto py-8 gap-y-4 sm:gap-y-0 text-center">
                    <li className="px-2 flex-1 text-center">
                      <button
                        onClick={() => {
                          setActiveTab("ESTX50 (OESX)");
                          scrollToMain();
                        }}
                        className={`text-base sm:text-lg md:text-xl text-center title-hover ${
                          activeTab === "ESTX50 (OESX)"
                            ? "active-title"
                            : "text-white"
                        }`}
                      >
                        EURO STOXX 50
                      </button>
                    </li>
                    <li className="px-2 flex-1 text-center">
                      <button
                        onClick={() => {
                          setActiveTab("SMI (OSMI)");
                          scrollToMain();
                        }}
                        className={`text-base sm:text-lg md:text-xl text-center title-hover ${
                          activeTab === "SMI (OSMI)"
                            ? "active-title"
                            : "text-white"
                        }`}
                      >
                        Swiss Market Index
                      </button>
                    </li>
                    <li className="px-1 lg:-ml-12 lg:mr-12 md:-ml-9 md:mr-9 sm:-ml-6 sm:mr-6 flex-1 text-center">
                      <button
                        onClick={() => {
                          scrollToFAQ();
                        }}
                        className={`text-base sm:text-lg md:text-xl text-center title-hover ${
                          activeTab === "FAQ"
                            ? "active-title"
                            : "text-white"
                        }`}
                      >
                        FAQ
                      </button>
                    </li> 
                </ul>
              </nav>
            </div>
          </header>

          <div className="w-full">
            <div className="w-[80%] mx-auto bg-[#010b1b] bg-opacity-60 px-4 sm:px-8">
              <main id="main-content" className="pt-48 sm:pt-40 lg:pt-[105px] pb-24">
                <InterestOverTimeChart endpoint={endpoint} instrument={activeTab} />
              </main>
            </div>
          </div>

          <div className="w-full">
            <div className="w-[80%] mx-auto bg-[#00050d] bg-opacity-50 px-4 sm:px-8">
              <section id="faq-section" className="scroll-mt-8">
                <FAQ />
              </section>
            </div>
          </div>

          <div className="w-full">
            <div className="w-[80%] mx-auto bg-[#00050d] bg-opacity-50">
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
      </div>
    </div>
  );
}

export default App;
