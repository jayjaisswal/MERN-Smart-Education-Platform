import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"
import "../../App.css"
import { FaStar } from "react-icons/fa"
import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

function StarRating({ rating }) {
  const fullStars = Math.floor(rating)
  const halfStar = rating - fullStars >= 0.5
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-yellow-400" />
      ))}
      {halfStar && <FaStar className="text-yellow-200" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaStar key={`empty-${i}`} className="text-gray-400" />
      ))}
    </div>
  )
}

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      if (data?.success) {
        setReviews(data?.data)
      }
    })()
  }, [])

  return (
    <div className="text-white w-full my-10">
      <Swiper
        loop={true}
        freeMode={true}
        autoplay={{
          delay: 0, // continuous
          disableOnInteraction: false,
        }}
        speed={4000} // slower = smoother
        modules={[FreeMode, Autoplay]}
        spaceBetween={25}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="w-full"
      >
        {reviews.map((review, i) => {
          const userName = review?.user
            ? `${review?.user?.firstName} ${review?.user?.lastName}`
            : "Anonymous"
          return (
            <SwiperSlide key={i}>
              <div className="flex flex-col gap-3 bg-gradient-to-br from-richblack-800 to-richblack-900 p-4 rounded-xl shadow-md hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${userName}`
                    }
                    alt={userName}
                    className="h-10 w-10 rounded-full object-cover border border-gray-600"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-richblack-5">
                      {userName}
                    </h1>
                    <h2 className="text-[12px] font-medium text-richblack-400">
                      {review?.course?.courseName || "Course"}
                    </h2>
                  </div>
                </div>

                <p className="font-medium text-richblack-25 text-sm leading-relaxed">
                  {review?.review.split(" ").length > truncateWords
                    ? `${review?.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")} ...`
                    : review?.review}
                </p>

                <div className="flex items-center gap-2 mt-auto">
                  <h3 className="font-semibold text-yellow-100">
                    {review.rating.toFixed(1)}
                  </h3>
                  <StarRating rating={review.rating} />
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default ReviewSlider
