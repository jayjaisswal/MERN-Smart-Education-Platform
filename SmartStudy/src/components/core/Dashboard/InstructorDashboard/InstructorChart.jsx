import { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(...registerables);

export default function InstructorChart({ courses }) {
  // State to keep track of the currently selected chart
  const [currChart, setCurrChart] = useState("students");

  // Beautiful color palette for the chart
  const beautifulColors = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#FFA07A", // Salmon
    "#98D8C8", // Mint
    "#F7DC6F", // Gold
    "#BB8FCE", // Purple
    "#85C1E2", // Sky Blue
    "#F8B88B", // Peach
    "#52CDA9", // Emerald
    "#FF9999", // Light Red
    "#FFD700", // Bright Gold
  ];

  // Generate colors with gradient effect
  const getColorsWithGradient = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      colors.push(beautifulColors[i % beautifulColors.length]);
    }
    return colors;
  };

  // Data for the chart displaying student information
  const chartDataStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: getColorsWithGradient(courses.length),
        borderColor: "#1f2937",
        borderWidth: 3,
        hoverBorderWidth: 5,
        hoverOffset: 15,
      },
    ],
  };

  // Data for the chart displaying income information
  const chartIncomeData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: getColorsWithGradient(courses.length),
        borderColor: "#1f2937",
        borderWidth: 3,
        hoverBorderWidth: 5,
        hoverOffset: 15,
      },
    ],
  };

  // Enhanced options for the chart with animations and effects
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      animateRotate: true,
      animateScale: false,
      duration: 1500,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
          font: {
            size: 13,
            weight: "600",
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => ({
                text: label,
                fillStyle: data.datasets[0].backgroundColor[i],
                fontColor: "#ffffff",
                hidden: false,
                index: i,
              }));
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#fbbf24",
        borderWidth: 2,
        padding: 12,
        displayColors: true,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div className="text-white flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6 shadow-lg">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>
      <div className="space-x-4 font-semibold">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-2 px-4 transition-all duration-300 transform hover:scale-105 ${currChart === "students"
            ? "bg-yellow-50 text-richblack-900 shadow-md"
            : "bg-richblack-700 text-yellow-400 hover:bg-richblack-600"
            }`}
        >
          Students
        </button>
        {/* Button to switch to the "income" chart */}
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-2 px-4 transition-all duration-300 transform hover:scale-105 ${currChart === "income"
            ? "bg-yellow-50 text-richblack-400 shadow-md"
            : "bg-richblack-700 text-yellow-400 hover:bg-richblack-600"
            }`}
        >
          Income
        </button>
      </div>
      <div className="relative mx-auto h-96 w-full p-4 flex flex-col justify-center">
        {/* Render the Doughnut chart with beautiful styling */}
        <Doughnut
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

