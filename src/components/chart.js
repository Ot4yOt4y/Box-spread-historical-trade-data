import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayInstrumentName, setInstrumentName] = useState("");
  const [daysOnHover, setDays] = useState(null);
  const sliderRef = React.useRef(null);
  const [movingSlider, setSlider] = useState(false);
  const [showDaysBack, setDaysBack] = useState("180");
  const [maxDaysBack, setMaxDaysBack] = useState(180);


  //merges date and trdtime into Date object
  const getCombinedDateTime = (dateStr, trdtime) => {
    const datePart = new Date(dateStr).toDateString();
    return new Date(`${datePart} ${trdtime}`);
  };

  //fetches box spread data when endpoint changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
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
        setLoading(false);
      }
    }
    fetchData();
  }, [endpoint]);

  //resets expiration filter when changed endpoit
  useEffect(() => {
    setSelectedExpiration("All");
  }, [endpoint]);

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
      };
    });

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
              return `${year} ${monthName}`;
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
        max: 5,
        ticks: {
          color: "gray",
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
          bottom: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataPoint = context.raw;
            return [
              `Index (instrument): ${dataPoint.instrument}`,
              `Annualized Interest Rate(%): ${dataPoint.y.toFixed(3)}`,
              `Contract Duration: ${dataPoint.contract_duration} days`,
              `Lower Strike: ${dataPoint.lower_strike}`,
              `Higher Strike: ${dataPoint.higher_strike}`,
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

  if (loading) return <div></div>;
  if (error) return <div>Error: {error}</div>;
  if (!chartData) return <div></div>;

  return (
    <div className="max-w-[1100px] mx-auto">
      <Line data={chartData} options={options} />
      <div className="mb-4 flex flex-col space-y-6 mt-10">
        <div className="flex items-center space-x-3">
          <label htmlFor="showDaysBack" className="text-white">
            Show trades from past:
          </label>
          <input
            type="number"
            id="daysBack"
            value={showDaysBack}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || (/^\d+$/.test(val) && val.length <= 5 && parseInt(val) <= maxDaysBack)) {
                setDaysBack(val);
              }
            }}
            min={1}
            max={maxDaysBack}
            className="bg-[#ffffff26] rounded border border-transparent hover:border-blue-100 text-white transition-colors duration-300 focus:outline-none w-16 text-center"
          />
          <span className="text-white">days</span>
        </div>
        <div className="flex items-center space-x-3">
          <label
            htmlFor="expirationFilter"
            className="text-white"
          >
            Filter by expiration date:
          </label>
          <select
            id="expirationFilter"
            value={selectedExpiration}
            onChange={(e) => setSelectedExpiration(e.target.value)}
            className="bg-[#ffffff26] h-8 pb-0.5 px-2 rounded border border-transparent hover:border-blue-100 text-white transition-colors duration-300 focus:outline-none focus:bg-[#26364b]"
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
        <div className="flex flex-col">
          <label className="text-white mb-2">
            Filter by contract duration:
          </label>
          <div className="mx-4">
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
                className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity duration-200"
                style={{ left: daysOnHover.x, transform: "translateX(-50%)" }}
              >
                {daysOnHover.value} days
              </div>
            )}
          </div>

          </div>
          <div className="text-white mt-1 text-sm text-center">
            {`Contract Duration: ${durationRange[0]} - ${durationRange[1]} days`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestOverTimeChart;
