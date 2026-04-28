import React from 'react'

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules'

import Course_Card from './Course_Card'

const CourseSlider = ({ Courses }) => {
  // Only enable loop if there are enough slides (at least 4 for desktop view with 3 slides per view)
  const shouldLoop = Courses?.length >= 4;

  return (
    <>
      {Courses?.length ? (
        <div className="pr-4">
          <Swiper
            slidesPerView={1}
            spaceBetween={25}
            loop={shouldLoop}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              waitForTransition: false,
            }}
            modules={[FreeMode, Pagination, Autoplay]}
            breakpoints={{
              1024: {
                slidesPerView: 3,
              },
            }}
            className="max-h-[30rem]"
          >
            {Courses?.map((course, i) => (
              <SwiperSlide key={i}>
                <Course_Card course={course} Height={"h-[250px]"} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  )
}

export default CourseSlider
