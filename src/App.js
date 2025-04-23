import React, { useState } from "react";
import InterestOverTimeChart from "./components/chart";
import FAQ from "./components/FAQ";

function App() {
  const [activeTab, setActiveTab] = useState("ESTX50 (OESX)");

  let endpoint;
    if (activeTab === "ESTX50 (OESX)") {
      endpoint = "http://127.0.0.1:5000/api/estx50";
    } else {
      endpoint = "http://127.0.0.1:5000/api/smi";
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
        <div className="bg-[#00142c] bg-opacity-70">
          <header className="pt-8 pl-8 pr-8 pb-16 border-[#d7dde5]]">
            <div className="container mx-auto flex items-center justify-center space-x-[0px]">
              <nav>
                <ul className="flex divide-x divide-gray-400">
                  <li className="text-xl font-[DM Sans] px-24">
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
                      ESTX50
                    </button>
                  </li>

                  <li className="text-xl font-[DM Sans] px-24">
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
                      SMI
                    </button>
                  </li>

                  <li className="text-xl font-[DM Sans] px-24">
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
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          <main>
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
