import { FaCheck } from "react-icons/fa"
import { useSelector } from "react-redux"

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm"
import CourseInformationForm from "./CourseInformation/CourseInformationForm"
import PublishCourse from "./PublishCourse"

export default function RenderSteps() {
  const { step } = useSelector((state) => state.course)

  const steps = [
    { id: 1, title: "Course Information" },
    { id: 2, title: "Course Builder" },
    { id: 3, title: "Publish" },
  ]

  return (
    <div className="w-full max-w-screen overflow-x-hidden px-2">
      {/* Step Circles and Lines */}
      <div className="relative mb-4 flex w-full flex-wrap justify-center items-center gap-x-2 overflow-x-auto">
        {steps.map((item, index) => (
          <div key={item.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <button
                className={`grid aspect-square w-[34px] place-items-center rounded-full border-[1.5px] transition-all duration-300
                  ${
                    step === item.id
                      ? "border-green-300 bg-green-800 text-white"
                      : "border-richblack-700 bg-richblack-800 text-richblack-300"
                  }
                  ${step > item.id && "bg-green-300 text-white"}
                `}
              >
                {step > item.id ? (
                  <FaCheck className="font-bold text-richblack-900" />
                ) : (
                  item.id
                )}
              </button>
            </div>

            {/* Dashed Line (except last step) */}
            {index !== steps.length - 1 && (
              <div
                className={`h-[2px] w-16 md:w-24 border-b-2 border-dashed mx-2 transition-all duration-300
                ${
                  step > item.id
                    ? "border-green-300"
                    : "border-richblack-500"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Step Titles */}
     <div className="relative mb-12 flex w-full select-none">
  {steps.map((item) => (
    <div key={item.id} className="flex-1 flex justify-center">
      <p
        className={`text-sm text-center ${
          step >= item.id ? "text-richblack-5" : "text-richblack-500"
        }`}
      >
        {item.title}
      </p>
    </div>
  ))}
</div>


      {/* Render the current form */}
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />}
    </div>
  )
}
