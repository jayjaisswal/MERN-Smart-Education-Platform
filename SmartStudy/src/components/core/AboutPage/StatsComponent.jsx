import React from "react";

const Stats = [
  { count: "5k", label: "Active Students" },
  { count: "10+", label: "Mentors" },
  { count: "200+", label: "Courses" },
  { count: "50+", label: "Awards" },
];

const StatsComponent = () => {
  return (
    <section>
      <div>
        <div className="flex gap-5">
          {Stats.map((items, index) => {
            return (
              <div key={index}>
                <h1>{items.count}</h1>
                <h2>{items.label}</h2>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsComponent;
