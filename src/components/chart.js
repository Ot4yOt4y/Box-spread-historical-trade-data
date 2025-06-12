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

    //filters data by expiration date
    let filteredData;
    if (selectedExpiration === "All") {
      filteredData = rawData;
    } else {
      filteredData = rawData.filter((item) => {
        return (
          new Date(item.expiration_date).getTime() ===
          new Date(selectedExpiration).getTime()
        );
      });
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
      console.log(spread.instrument);
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
      ],
    });
  }, [rawData, selectedExpiration, durationRange]);

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
          size: 12,
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
              `Instrument: ${dataPoint.instrument}`,
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
      <div className="mb-4 flex flex-col space-y-6 mt-12">
        <div className="flex items-center space-x-3">
          <label
            htmlFor="expirationFilter"
            className="font-semibold text-white"
          >
            Filter by Expiration Date:
          </label>
          <select
            id="expirationFilter"
            value={selectedExpiration}
            onChange={(e) => setSelectedExpiration(e.target.value)}
            className="bg-[#ffffff26] rounded px-2 py-1 focus:outline-none focus:bg-blue-100"
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
        <div className="pt-4 flex flex-col">
          <label className="font-semibold text-white mb-2">
            Filter by Contract Duration:
          </label>
          <div className="mx-4">
            <Slider
              range
              min={durationBounds[0]}
              max={durationBounds[1]}
              value={durationRange}
              onChange={(value) => setDurationRange(value)}
              trackStyle={{ backgroundColor: "black" }}
              railStyle={{ backgroundColor: "#ffffff26" }}
              handleStyle={[{ borderColor: "black" }, { borderColor: "black" }]}
            />
          </div>
          <div className="text-white mt-2 text-center">
            {`Contract Duration: ${durationRange[0]} - ${durationRange[1]} days`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestOverTimeChart;
