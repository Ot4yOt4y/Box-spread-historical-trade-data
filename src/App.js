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

  return (
    <div className="min-h-screen flex flex-col ">
      <div className="flex-1 shadow-lg bg-[url(/public/background.png)] bg-cover bg-center ...">
        <div className="bg-[#00142c] bg-opacity-80 bg-gradient-to-r from-transparent from-0% via-[#00142c] via-50% to-transparent to-100% ...">
          <header className="fixed top-0 left-0 w-full z-50 pt-8 pl-8 pr-8 pb-8 backdrop-blur-md bg-transparent">
            <div className="container mx-auto flex items-center justify-center space-x-[0px]">
              <nav>
                <ul className="flex divide-x divide-gray-400">
                  <h1 className="text-xl font-[DM Sans] px-24">
                    <button
                      onClick={() => setActiveTab("ESTX50 (OESX)")}
                      className={`${
                        activeTab === "ESTX50 (OESX)"
                          ? "underline underline-offset-[12px] decoration-[0.15rem] text-blue-100 text-shadow"
                          : "text-white"
                      } hover:text-blue-100 text-shadow border-hidden relative 
                        cursor-pointer transition-all ease-in-out before:transition-[width] 
                        before:ease-in-out before:duration-700 before:absolute before:bg-blue-100
                        before:origin-center before:h-[2px] before:w-0 hover:before:w-[50%] before:bottom-[-8px] 
                        before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute 
                        after:bg-blue-100 after:origin-center after:h-[2px] after:w-0 hover:after:w-[50%] after:bottom-[-8px] after:right-[50%]`}
                    >
                      EURO STOXX 50
                    </button>
                  </h1>

                  <h1 className="text-xl font-[DM Sans] px-24">
                    <button
                      onClick={() => setActiveTab("SMI (OSMI)")}
                      className={`${
                        activeTab === "SMI (OSMI)"
                          ? "underline underline-offset-[12px] decoration-[0.15rem] text-blue-100 text-shadow"
                          : "text-white"
                      } hover:text-blue-100 text-shadow border-hidden relative 
                        cursor-pointer transition-all ease-in-out before:transition-[width] 
                        before:ease-in-out before:duration-700 before:absolute before:bg-blue-100
                        before:origin-center before:h-[2px] before:w-0 hover:before:w-[50%] before:bottom-[-8px] 
                        before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute 
                        after:bg-blue-100 after:origin-center after:h-[2px] after:w-0 hover:after:w-[50%] after:bottom-[-8px] after:right-[50%]`}
                    >
                      Swiss Market Index
                    </button>
                  </h1>

                  <h1 className="text-xl font-[DM Sans] px-24 mr-20">
                    <button
                      onClick={scrollToFAQ}
                      className={`${
                        activeTab === "FAQ"
                          ? "underline underline-offset-[12px] decoration-[0.15rem] text-blue-100 text-shadow"
                          : "text-white"
                      } hover:text-blue-100 text-shadow border-hidden relative 
                            cursor-pointer transition-all ease-in-out before:transition-[width] 
                            before:ease-in-out before:duration-700 before:absolute before:bg-blue-100
                            before:origin-center before:h-[2px] before:w-0 hover:before:w-[50%] before:bottom-[-8px] 
                            before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute 
                            after:bg-blue-100 after:origin-center after:h-[2px] after:w-0 hover:after:w-[50%] after:bottom-[-8px] after:right-[50%]`}
                    >
                      FAQ
                    </button>
                  </h1>
                </ul>
              </nav>
            </div>
          </header>

          <main className="pt-[120px] mb-24">
            <InterestOverTimeChart endpoint={endpoint} instrument={activeTab} />
          </main>

          <faq id="faq-section" className="mt-24">
            <FAQ />
          </faq>
        </div>
      </div>
    </div>
  );
}

export default App;
