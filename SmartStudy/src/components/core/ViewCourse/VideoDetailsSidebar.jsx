import { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { RiMenu3Fill } from "react-icons/ri"; // Add this import
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import IconBtn from "../../common/IconBtn";

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Add this state
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId } = useParams();
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    (() => {
      if (!courseSectionData.length) return;
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      );
      const currentSubSectionIndx = courseSectionData?.[
        currentSectionIndx
      ]?.subSection.findIndex((data) => data._id === subSectionId);
      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.subSection?.[
          currentSubSectionIndx
        ]?._id;
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id);
      setVideoBarActive(activeSubSectionId);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname]);

  return (
    <>
      {/* Mobile Menu Button - Adjusted position */}
      <button
        className="fixed top-[4.5rem] left-4 z-110 md:hidden bg-richblack-700 p-2 rounded-full"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <RiMenu3Fill size={24} className="text-richblack-25" />
      </button>

      {/* Sidebar - Adjusted top position */}
      <div
        className={`
        fixed top-[3.5rem] left-0 h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] 
        flex flex-col border-r-[1px] border-r-richblack-700 
        bg-richblack-800 transition-transform duration-300 ease-in-out
        md:relative md:top-0 md:translate-x-0 md:h-screen
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        z-130
      `}
      >
        {/* Sidebar Header - Add this section back */}
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          <div className="flex w-full items-center justify-between ">
            <div
              onClick={() => {
                navigate(`/dashboard/enrolled-courses`);
                setIsMenuOpen(false);
              }}
              className="flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
              title="back"
            >
              <IoIosArrowBack size={30} />
            </div>
            <IconBtn
              text="Add Review"
              customClasses="ml-auto"
              onclick={() => {
                setReviewModal(true);
                setIsMenuOpen(false);
              }}
            />
          </div>
          <div className="flex flex-col">
            <p>{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>

        {/* Sidebar Content */}
        {/* Sidebar Content - Adjust the lecture section styling */}
        <div className="h-[calc(100vh-8rem)] overflow-y-auto">
          {courseSectionData.map((course, index) => (
            <div
              className="mt-2 cursor-pointer text-sm text-richblack-5"
              key={index}
            >
              {/* Section Title */}
              <div
                className="flex flex-col bg-richblack-700 px-5 py-4" // Changed to flex-col
                onClick={() =>
                  setActiveStatus(
                    activeStatus === course?._id ? "" : course?._id
                  )
                }
              >
                <div className="w-full font-semibold">
                  {course?.sectionName}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[12px] font-medium">
                    {course?.subSection?.length || 0} lecture(s)
                  </span>
                  <span
                    className={`transition-transform duration-300 ${
                      activeStatus === course?._id ? "rotate-180" : ""
                    }`}
                  >
                    <BsChevronDown />
                  </span>
                </div>
              </div>

              {/* Sub Sections - Added transition and proper height animation */}
              <div
                className={`flex flex-col transition-all duration-300 ease-in-out ${
                  activeStatus === course?._id
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                {course?.subSection?.map((topic, i) => (
                  <div
                    className={`flex items-center gap-3 px-5 py-2 ${
                      videoBarActive === topic._id
                        ? "bg-yellow-200 font-semibold text-richblack-800"
                        : "hover:bg-richblack-900"
                    }`}
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                      );
                      setVideoBarActive(topic._id);
                      setIsMenuOpen(false);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={completedLectures.includes(topic?._id)}
                      onChange={() => {}}
                    />
                    <span className="text-sm">{topic.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
