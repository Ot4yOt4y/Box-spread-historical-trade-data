import React, { useState, useEffect } from "react";
import InterestOverTimeChart from "./components/chart";
import FAQ from "./components/FAQ";

function App() {
  const [activeTab, setActiveTab] = useState("ESTX50 (OESX)");
  const [showHamburgerMenu, setshowHamburgerMenu] = useState(false);

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1800) {
        setshowHamburgerMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div className="min-h-screen flex flex-col bg-[url(/public/background.jpeg)] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="flex-1 shadow-lg">
        <div
          className="bg-[#010b1b] sm:bg-opacity-70 md-lg-main2:bg-opacity-70"
          style={{
            backgroundImage:
              'linear-gradient(to right, transparent 0%, #010b1b 30%, #010b1b 70%, transparent 100%)'
          }}
        >
          <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
            <div className="w-[100%] md-lg-main2:w-[80%] mx-auto border-b border-gray-400 border-opacity-30 backdrop-blur-3xl">
              <nav className="relative">
                <div className="hidden flex justify-between items-center mx-auto py-6 md-lg-main2:w-[77%] md-lg-main-2:w-[65%] md-lg-main-1-2:w-[69%] md-lg-main1:w-[71%] md-lg-main-1:w-[76%] md-lg-main:w-[80%] md:w-[84%]">
                  <div className="flex w-full items-center md-lg-main2:gap-16">
                    <div className="text-lg pt-0.5 text-white space">Box Spread - Historical trade data</div>
                    <div className="flex md-lg-main2:space-x-16 ml-auto pr-4">
                      <button
                        onClick={() => {
                          setActiveTab("ESTX50 (OESX)");
                          scrollToMain();
                        }}
                          className={`text-sm sm:text-base md:text-lg title-hover ${
                          activeTab === "ESTX50 (OESX)"
                            ? "active-title"
                            : "text-white"
                        }`}
                      >
                        EURO STOXX 50
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("SMI (OSMI)");
                          scrollToMain();
                        }}
                          className={`text-sm sm:text-base md:text-lg title-hover ${
                          activeTab === "SMI (OSMI)"
                            ? "active-title"
                            : "text-white"
                        }`}
                      >
                        Swiss Market Index
                      </button>
                      <button
                        onClick={() => {
                          scrollToFAQ();
                        }}
                          className={`text-sm sm:text-base md:text-lg title-hover ${
                          activeTab === "FAQ"
                            ? "active-title"
                            : "text-white"
                        }`}
                      >
                        FAQ
                      </button>
                    </div>
                  </div> 
                </div>

                <div className="flex justify-start px-4 py-4">
                  <button
                    onClick={() => setshowHamburgerMenu((prev) => !prev)}
                    className="text-white focus:outline-none hover:text-blue-100 hover:scale-105"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                {showHamburgerMenu && (
                <div className="relative before:content-[''] before:absolute before:inset-0 before:-z-10 before:backdrop-blur-3xl border-b border-gray-400 border-opacity-30 z-50">
                    <ul className="py-4 flex flex-col items-start space-y-2 pl-5">
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab("ESTX50 (OESX)");
                            scrollToMain();
                            setshowHamburgerMenu(false);
                          }}
                          className={`text-sm sm:text-base md:text-lg hover:hamburger-title ${
                            activeTab === "ESTX50 (OESX)"
                              ? "hamburger-title"
                              : "text-white"
                          }`}
                        >
                          EURO STOXX 50
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setActiveTab("SMI (OSMI)");
                            scrollToMain();
                            setshowHamburgerMenu(false);
                          }}
                          className={`text-sm sm:text-base md:text-lg hover:hamburger-title ${
                            activeTab === "SMI (OSMI)"
                              ? "hamburger-title"
                              : "text-white"
                          }`}
                        >
                          Swiss Market Index
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            scrollToFAQ();
                            setshowHamburgerMenu(false);
                          }}
                          className={`text-sm sm:text-base md:text-lg hover:hamburger-title ${
                            activeTab === "FAQ"
                              ? "hamburger-title"
                              : "text-white"
                          }`}
                        >
                          FAQ
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </nav>
            </div>
          </header>

          <div className="w-full">
            <div className="w-[100%] md-lg-main2:w-[80%] mx-auto bg-[#010b1b] bg-opacity-50 px-2 reset-on-top:px-4 sm:px-8">
              <main id="main-content" className="pt-12 md:pt-20 md-lg-main2:pt-20 pb-20 reset-on-top:pb-24">
                <InterestOverTimeChart endpoint={endpoint} instrument={activeTab} />
              </main>
            </div>
          </div>

          <div className="w-full">
            <div className="w-[100%] md-lg-main2:w-[80%] mx-auto bg-[#00050d] bg-opacity-30 px-4 sm:px-8">
              <section id="faq-section" className="scroll-mt-8">
                <FAQ />
              </section>
            </div>
          </div>

          <div className="w-full">
            <div className="w-[100%] md-lg-main2:w-[80%] mx-auto bg-[#00050d] bg-opacity-30">
              <footer className="text-center text-xs text-gray-400 pt-4 pb-4 backdrop-blur-3xl bg-transparent border-t border-gray-400 border-opacity-30">
                <div className="flex items-center justify-center space-x-1">
                  <svg
                    className="w-4 h-4 pr-1 fill-current text-gray-400"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.2.8-.5v-1.7c-3.2.7-3.9-1.5-3.9-1.5-.6-1.4-1.5-1.7-1.5-1.7-1.2-.8.1-.8.1-.8 1.3.1 2 .9 2 .9 1.2 2.1 3.1 1.5 3.8 1.1.1-.9.5-1.5.9-1.9-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.1 0 4.6-2.8 5.6-5.4 5.9.5.5 1 1.3 1 2.6v3.8c0 .3.2.6.8.5A10.5 10.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5z" />
                  </svg>
                  <a
                    href="https://github.com/Ot4yOt4y/Box-spread-historical-trade-data"
                    className="hover:underline"
                  >
                    https://github.com/Ot4yOt4y/Box-spread-historical-trade-data
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
