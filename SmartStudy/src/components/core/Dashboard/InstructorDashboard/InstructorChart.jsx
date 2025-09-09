import { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables);

export default function InstructorChart({ courses }) {
  // State to keep track of the currently selected chart
  const [currChart, setCurrChart] = useState("students");

  // Function to generate random colors for the chart
  const generateRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`;
      colors.push(color);
    }
    return colors;
  };

  // Data for the chart displaying student information
  const chartDataStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  };

  // Data for the chart displaying income information
  const chartIncomeData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: generateRandomColors(courses.length),
      },
    ],
  };

  // Options for the chart
  const options = {
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>
      <div className="space-x-4 font-semibold">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>
        {/* Button to switch to the "income" chart */}
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>
      <div className="relative mx-auto aspect-square h-full w-full">
        {/* Render the Pie chart based on the selected chart */}
        <Pie
          data={currChart === "students" ? chartDataStudents : chartIncomeData}
          options={options}
        />
      </div>
    </div>
  );
}


// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// export default function InstructorChart() {
//   const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Mentoring",
//         data: [3, 2, 4, 5, 3, 2, 4],
//         backgroundColor: "#22c55e", // green
//         borderRadius: 6,
//       },
//       {
//         label: "Self Learning",
//         data: [2, 3, 5, 4, 6, 5, 3],
//         backgroundColor: "#eab308", // yellow
//         borderRadius: 6,
//       },
//       {
//         label: "Students",
//         data: [4, 5, 3, 2, 5, 4, 6],
//         backgroundColor: "#3b82f6", // blue
//         borderRadius: 6,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         labels: { color: "#fff" },
//       },
//     },
//     scales: {
//       x: {
//         ticks: { color: "#d1d5db" },
//         grid: { color: "rgba(255,255,255,0.1)" },
//       },
//       y: {
//         ticks: { color: "#d1d5db" },
//         grid: { color: "rgba(255,255,255,0.1)" },
//       },
//     },
//   };

//   return (
//     <div className="flex-1 rounded-md bg-richblack-800 p-6">
//       <p className="text-lg font-bold text-richblack-5 mb-4">Productivity</p>
//       <div className="h-72">
//         <Bar data={data} options={options} />
//       </div>
//     </div>
//   );
// }

