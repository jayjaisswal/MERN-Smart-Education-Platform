import React from "react";
import CTAButton from "./Button";
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
const CodeBlocks = ({
  position,
  heading,
  subHeading,
  ctabtn1,
  ctabtn2,
  codeblock,
  backgroundGradient,
  codeColor,
}) => {
  return (
    <div className={`flex ${position} mt-20 justify-between gap-10  `}>
      {/* section 1 */}
      <div className="w-[50%] flex flex-col gap-8">
        {/* Heading */}
        {heading}

        {/* subHeading */}
        <div className="text-richblack-300 font-bold text-justify hidden sm:block">
          {subHeading}
        </div>

        {/* btn */}
        <div className="flex gap-7 mt-7">
          {/* btn1 */}
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
            <div className="flex gap-2 items-center">
              {ctabtn1.btntext}
              <FaArrowRight />
            </div>
          </CTAButton>

          {/* btn2 */}
          <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
            {ctabtn2.btntext}
          </CTAButton>
        </div>
      </div>

      {/* section 2 */}
      {/* Section 2: Code Block with Styling */}
      <div className="w-full lg:w-[500px] flex py-4 text-[14px] h-fit">
        {/* Line Numbers */}
        <div className="w-[10%] text-richblack-400 font-mono font-bold flex flex-col items-center gap-1">
          {Array.from({ length: 11 }, (_, i) => (
            <p key={i}>{i + 1}</p>
          ))}
        </div>

        {/* Animated Code Block */}
        <div
          className={`w-[90%] font-mono ${codeColor} pr-3 py-3 px-4 rounded-lg bg-gradient-to-br from-richblack-800 to-richblack-900 shadow-[0_4px_20px_rgba(0,0,0,0.4)] overflow-auto`}
        >
          <TypeAnimation
            sequence={[codeblock, 100, ""]}
            repeat={Infinity}
            cursor={true}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;
