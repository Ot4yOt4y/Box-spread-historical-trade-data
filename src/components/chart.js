import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

function linearRegression(points) {
  const n = points.length;
  if (n < 2) {
    return [];
  }
  
  let X = 0, Y = 0;
  let XY = 0, X2 = 0;

  for (let i = 0; i < n; i++) {
    let x;
    if(points[i].x instanceof Date) {
      x = points[i].x.getTime();
    } else {
      x = points[i].x;
    }
    const y = points[i].y;
    X += x;
    Y += y;
    XY += x*y;
    X2 += x*x;
  }

  const slope = (n*XY - X*Y) / (n*X2 - X*X);
  const expectedY = (Y - slope*X) / n;

  const minX = Math.min(...points.map(p => new Date(p.x).getTime()));
  const maxX = Math.max(...points.map(p => new Date(p.x).getTime()));

  return [
    {x: new Date(minX), y: slope*minX + expectedY},
    {x: new Date(maxX), y: slope*maxX + expectedY},
  ];
}

const InterestOverTimeChart = ({ endpoint, instrument }) => {
  const [rawData, setRawData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [expirationOptions, setExpirationOptions] = useState([]);
  const [selectedExpiration, setSelectedExpiration] = useState("All");
  const [durationRange, setDurationRange] = useState([0, 100]);
  const [durationBounds, setDurationBounds] = useState([0, 100]);
  //const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayInstrumentName, setInstrumentName] = useState("");
  const [daysOnHover, setDays] = useState(null);
  const sliderRef = React.useRef(null);
  const [movingSlider, setSlider] = useState(false);
  const [showDaysBack, setDaysBack] = useState("267");
  const [maxDaysBack, setMaxDaysBack] = useState(267);


  //merges date and trdtime into Date object
  const getCombinedDateTime = (dateStr, trdtime) => {
    const datePart = new Date(dateStr).toDateString();
    return new Date(`${datePart} ${trdtime}`);
  };

  const resetAllFilters = () => {
    setSelectedExpiration("All");
    setDaysBack(maxDaysBack.toString());
    
    //calculate lowest and highest days for new duration based on maxdaysback
    const now = new Date();
    const earliestDate = new Date();
    earliestDate.setDate(now.getDate() - maxDaysBack);

    const filterBasedOnDays = rawData.filter((item) => {
      const tradeDate = getCombinedDateTime(item.date, item.trdtime);
      return tradeDate >= earliestDate;
    });

    const filteredByExp = filterBasedOnDays;

    const durations = filteredByExp.map((item) => item.contract_duration);
    const newMin = Math.min(...durations);
    const newMax = Math.max(...durations);

    setDurationBounds([newMin, newMax]);
    setDurationRange([newMin, newMax]);  
  };

  //for resizing graph
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
  const resizeChart = () => {
    if (chartRef.current) {
      chartRef.current.resize();
    }
  };
  window.addEventListener("resize", resizeChart);
    return () => window.removeEventListener("resize", resizeChart);
  }, []);

  //fetches box spread data when endpoint changes
  useEffect(() => {
    async function fetchData() {
      //setLoading(true);
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();

        //sorts data by date and trdtime
        const sortedData = data.sort((a, b) => {
          const dtA = getCombinedDateTime(a.date, a.trdtime);
          const dtB = getCombinedDateTime(b.date, b.trdtime);
          return dtA - dtB;
        });
        setRawData(sortedData);

        if (sortedData.length > 0) {
          const firstDate = getCombinedDateTime(sortedData[0].date, sortedData[0].trdtime);
          const currentDay = new Date();
          const difference = currentDay - firstDate;
          const diffInDays = Math.floor(difference / (1000*60*60*24));
          setMaxDaysBack(diffInDays+1);
        }

        //extracts expiration dates
        const expirations = Array.from(
          new Set(
            sortedData.map((item) => new Date(item.expiration_date).getTime())
          )
        );
        const expDates = expirations.map((ts) => new Date(ts).toISOString());
        expDates.sort((a, b) => new Date(a) - new Date(b));
        setExpirationOptions(expDates);

        //calculates mininum and maximum contract duration
        const durations = sortedData.map((item) => item.contract_duration);
        const minDuration = Math.min(...durations);
        const maxDuration = Math.max(...durations);
        setDurationBounds([minDuration, maxDuration]);
        setDurationRange([minDuration, maxDuration]);
      } catch (error) {
        setError(error.message);
      } finally {
        //setLoading(false);
      }
    }
    fetchData();
  }, [endpoint]);

  //resets expiration filter when changed endpoit
  useEffect(() => {
    setSelectedExpiration("All");
  }, [endpoint]);

  useEffect(() => {
  if (rawData.length === 0) return;

  const now = new Date();
  const earliestDate = new Date();
  earliestDate.setDate(now.getDate() - parseInt(showDaysBack || 0));

  const filterBasedOnDays = rawData.filter((item) => {
    const tradeDate = getCombinedDateTime(item.date, item.trdtime);
    return tradeDate >= earliestDate;
  });

  let filteredData = filterBasedOnDays;
  if (selectedExpiration !== "All") {
    filteredData = filteredData.filter(
      (item) => new Date(item.expiration_date).getTime() === new Date(selectedExpiration).getTime()
    );
  }

  const durations = filteredData.map((item) => item.contract_duration);
  if (durations.length > 0) {
    const newMin = Math.min(...durations);
    const newMax = Math.max(...durations);
    setDurationBounds([newMin, newMax]);
    setDurationRange([newMin, newMax]);

  } else {
    setDurationBounds([0, 0]);
    setDurationRange([0, 0]);
  }
}, [rawData, selectedExpiration, showDaysBack]);

  //updates chart according to filters
  useEffect(() => {
    if (rawData.length === 0) return;

    const now = new Date();
    const earliestDate = new Date();
    earliestDate.setDate(now.getDate() - parseInt(showDaysBack || 0));

    const filteredByDays = rawData.filter((item) => {
      const tradeDate = getCombinedDateTime(item.date, item.trdtime);
      return tradeDate >= earliestDate;
    });

    const expirations = Array.from(
      new Set(filteredByDays.map((item) => new Date(item.expiration_date).getTime()))
    ).map((ts) => new Date(ts).toISOString()).sort((a, b) => new Date(a) - new Date(b));

    setExpirationOptions(expirations);

    if (selectedExpiration !== "All" && !expirations.includes(selectedExpiration)) {
      setSelectedExpiration("All");
    }

    let filteredData = filteredByDays;
    if (selectedExpiration !== "All") {
      filteredData = filteredData.filter((item) =>
          new Date(item.expiration_date).getTime() === new Date(selectedExpiration).getTime()
      );
    }

    //filters data by contract duration
    filteredData = filteredData.filter(
      (item) =>
        item.contract_duration >= durationRange[0] &&
        item.contract_duration <= durationRange[1]
    );

    //maps data to chart data points
    const chartPoints = filteredData.map((spread) => {
      const combinedDatetime = getCombinedDateTime(spread.date, spread.trdtime);
      let instrumentName;
      if (spread.instrument === "OESX"){
        instrumentName = "EURO STOXX 50 (OESX)";
      } else if (spread.instrument === "OSMI") {
        instrumentName = "Swiss Market Index (OSMI)";
      } else {
        instrumentName = spread.instrument;
      }
      return {
        x: combinedDatetime,
        y: parseFloat(spread.interest_rate),
        id: spread.id,
        instrument: instrumentName,
        contract_duration: spread.contract_duration,
        lower_strike: spread.lower_strike,
        higher_strike: spread.higher_strike,
        //volume: spread.volume,
        //loan_amount: (spread.higher_strike-spread.lower_strike)*10*spread.volume
      };
    });

    //console.log("chart points:", chartPoints[0]);

    //selects instrument name from first data point
    if (chartPoints.length > 0) {
      setInstrumentName(chartPoints[0].instrument);
    }

    const trend = linearRegression(chartPoints);

    setChartData({
      datasets: [
        {
          label: "Interest Rate",
          data: chartPoints,
          borderColor: "white",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          pointRadius: 3,
          tension: 0.1,
          showLine: false,
        },
        {
          label: "Trend Line",
          data: trend,
          borderColor: "#dbeafe",
          borderDash: [5, 5],
          borderWidth: 0.3,
          pointRadius: 0,
          tension: 0,
          showLine: true,
        },
      ],
    });
  }, [rawData, selectedExpiration, durationRange, showDaysBack]);

  const options = {
    responsive: true,
     maintainAspectRatio: false,
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
        },
        ticks: {
          callback: function (value, index) {
            const dateObj = new Date(value);
            const monthName = dateObj.toLocaleString("en-US", {
              month: "short",
            });
            const year = dateObj.getFullYear();
            if (index === 0 || dateObj.getMonth() === 0) {
              return `${year}`;
            }
            return monthName;
          },
          color: "gray",
        },
        grid: {
          color: "black",
        },
      },
      y: {
        min: 0,
        max: 6,
        ticks: {
          color: "gray",
          stepSize: 0.5,
        },
        grid: {
          color: "black",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Interest Rate for ${displayInstrumentName} box spread trades`,
        color: "gray",
        font: {
          size: 13,
          weight: "lighter",
        },
        padding: {
          top: 8,
          bottom: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataPoint = context.raw;
            /*
            var currency;
            if (dataPoint.instrument === "EURO STOXX 50 (OESX)") {
              currency = 'EUR';
            } else {
              currency = 'CHF'
            }
            */
            return [
              `Index (instrument): ${dataPoint.instrument}`,
              `Annualized Interest Rate: ${dataPoint.y.toFixed(2)}%`,
              `Contract Duration: ${dataPoint.contract_duration} days`,
              `Lower Strike: ${dataPoint.lower_strike}`,
              `Higher Strike: ${dataPoint.higher_strike}`,
              //`Volume: ${dataPoint.volume}`,
              //`Loan Amount: ${dataPoint.loan_amount} ${currency}`
            ];
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
        },
      },
    },
  };
  /*
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner" />
      </div>
    );
  }
  */
  if (error) return <div>Error: {error}</div>;
  if (!chartData) return <div></div>;

   const filterIsDefault = (
    selectedExpiration === "All" &&
    parseInt(showDaysBack) === maxDaysBack &&
    durationRange[0] === durationBounds[0] &&
    durationRange[1] === durationBounds[1]
  );


 return (
    <div className="md-lg-main2:w-[80%] md-lg-main12:w-[64%] md-lg-main-2:w-[66%] md-lg-main-1-2:w-[66%] md-lg-main1:w-[68%] md-lg-main-1:w-[72%] md-lg-main:w-[72%] lg-main:w-[77%] lg:w-[85%] md-lg:w-[88%] md:w-[90%] sm:w-[96%] mx-auto" ref={containerRef}>
      <div className="w-full h-[50vw] md-lg-main2:max-h-[540px] md-lg-main12:max-h-[530px] md-lg-main-2:max-h-[525px] md-lg-main-1-2:max-h-[515px] md-lg-main1:max-h-[505px] md-lg-main-1:max-h-[495px] md-lg-main:max-h-[475px] lg-main:max-h-[465px] lg:max-h-[445px] md-lg:max-h-[430px] md-1:max-h-[410px] md:max-h-[375px] sm:max-h-[355px] min-h-[400px] mini:min-h-[450px] reset-on-top:min-h-[100px] reset-on-top:mb-4 mt-8 bg-[#0f172a] bg-opacity-15 pt-4 pb-5 pl-4 pr-4 reset-on-top:p-0 reset-on-top:bg-transparent reset-on-top:p-0">
        <Line ref={chartRef} data={chartData} options={options}/>
      </div>
      <div className="w-full flex flex-col reset-on-top:pt-4 pb-4 mb-8 reset-on-top:space-y-6 space-y-1.5 sm-md:mt-8 bg-[#00142c] bg-opacity-0 border-opacity-50 reset-on-top:border-t-[2px] reset-on-top:border-b-[2px] border-black">
      <div className="flex flex-col reset-on-top:flex-row-reverse reset-on-top:items-center reset-on-top:justify-between w-full">
        <div className="flex justify-end items-end mb-4 reset-on-top:mb-0">
          <button
            onClick={resetAllFilters}
            disabled={filterIsDefault}
            className={`text-sm rounded-sm text-[#808080] reset-on-top:text-red-800 mr-4 reset-on-top:mr-0 reset-on-top:px-1 underline underline-offset-4 hover:border-blue-100 ${
              filterIsDefault ? "opacity-70" : "hover:font-medium transition duration-300"
            }`}
          > Reset filters
          </button>
        </div>
        <div className="flex flex-col reset-on-top:flex-row reset-on-top:items-center reset-on-top:space-x-3 space-y-1 reset-on-top:space-y-0 bg-[#0f172a] bg-opacity-15 pl-4 pr-4 pt-5 pb-5 reset-on-top:bg-transparent reset-on-top:p-0 reset-on-top:shadow-none">
          <label htmlFor="showDaysBack" className="text-white font-medium">
            Show trades from past:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              id="daysBack"
              value={showDaysBack}
              onChange={(e) => {
                const val = e.target.value;
                if (parseInt(val) >= maxDaysBack) {
                  setDaysBack(maxDaysBack)
                } else if (val === "" || (/^\d+$/.test(val) && val.length <= 5 && parseInt(val) <= maxDaysBack)) {
                  setDaysBack(val);
                }
              }}
              min={1}
              max={maxDaysBack}
              className="bg-[#ffffff26] rounded-sm border border-transparent hover:border-blue-100 text-white transition-colors duration-300 focus:outline-none text-center"
            />
            <span className="reset-on-top:hidden text-white text-sm">(max {maxDaysBack} days)</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col reset-on-top:flex-row reset-on-top:items-center reset-on-top:space-x-3 space-y-2 reset-on-top:space-y-0 bg-[#0f172a] bg-opacity-15 pl-4 pr-4 pt-5 pb-5 reset-on-top:bg-transparent reset-on-top:p-0 reset-on-top:shadow-none">
        <label 
          htmlFor="expirationFilter" 
          className="text-white font-medium">
          Filter by expiration date:
        </label>
        <select
          id="expirationFilter"
          value={selectedExpiration}
          onChange={(e) => setSelectedExpiration(e.target.value)}
          className="bg-[#ffffff26] h-8 pb-0.5 px-2 rounded-sm border border-transparent hover:border-blue-100 text-white transition-colors duration-300 focus:outline-none focus:bg-[#26364b]"
        >
          <option value="All">All</option>
          {expirationOptions.map((exp, index) => (
            <option key={index} value={exp}>
              {new Date(exp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-3 w-full mt-6 space-y-2 sm:space-y-0 bg-[#0f172a] bg-opacity-15 pl-4 pr-4 pt-5 pb-5 reset-on-top:bg-transparent reset-on-top:p-0 reset-on-top:shadow-none">
        <label className="text-white whitespace-nowrap font-medium">
          Filter by contract duration:
        </label>
        <div className="flex flex-col w-full items-center sm:items-start sm:pt-1.5 px-0 px-2">
          <div className="w-full flex flex-col items-center self-center">
            <div
              ref={sliderRef}
              className="relative w-full"
              onMouseMove={(e) => {
                const bounds = sliderRef.current.getBoundingClientRect();
                const x = e.clientX - bounds.left; // Mouse position relative to slider
                const percent = Math.min(Math.max(x / bounds.width, 0), 1);
                const value = Math.round(durationBounds[0] + percent * (durationBounds[1] - durationBounds[0]));
                setDays({ x, value });
              }}
              onMouseLeave={() => setDays(null)}
            >
            <Slider
              range
              min={durationBounds[0]}
              max={durationBounds[1]}
              value={durationRange}
              onChange={(value) => setDurationRange(value)}
              onBeforeChange={() => setSlider(true)}
              onAfterChange={() => setSlider(false)}
              trackStyle={{ backgroundColor: "black" }}
              railStyle={{ backgroundColor: "#ffffff26" }}
              handleStyle={[{ borderColor: "black" }, { borderColor: "black" }]}
            />
            {daysOnHover && !movingSlider && (
                <div
                  className="absolute -top-8 bg-gray-800 text-white text-reset-on-top px-2 py-1 rounded pointer-events-none transition-opacity duration-200"
                  style={{ left: daysOnHover.x, transform: "translateX(-50%)" }}
                >
                  {daysOnHover.value} days
                </div>
              )}
            </div>
            <div className="text-white mt-1 text-sm text-center">
              {`Contract Duration: ${durationRange[0]} - ${durationRange[1]} days`}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestOverTimeChart;
