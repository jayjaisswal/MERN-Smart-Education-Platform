import { FcGoogle } from "react-icons/fc"
import { useSelector } from "react-redux"
import Spinner from "../../../spinner/Spinner"

import frameImg from "../../../assets/Images/frame.png"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

function Template({ title, description1, description2, image, formType }) {
  const { loading } = useSelector((state) => state.auth)

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center w-11/12 mx-auto">
      {loading ? (
        <div><Spinner/></div>
      ) : (
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12">
          <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
          {/* Demo Credentials */}
            <div className="mb-4 p-3 rounded bg-richblack-800 text-richblack-100 text-sm border border-richblack-700">
              <div className="mb-2 text-xs text-yellow-300">
                Note: First load may take time. If login fails, please try again.
                Because Data Fetched from Render.com
              </div>
              <div className="mb-2 font-bold text-richblack-5">Demo Accounts:</div>
              <div>
                <span className="font-semibold">Student</span>:<br />
                Username: <span className="font-mono">kumarprince138333@gmail.com</span><br />
                Password: <span className="font-mono">123456</span>
              </div>
              <div className="mt-2">
                <span className="font-semibold">Instructor</span>:<br />
                Username: <span className="font-mono">kumarprince13833@gmail.com</span><br />
                Password: <span className="font-mono">123456</span>
              </div>
            </div>

            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
              {title}
            </h1>
            <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
              <span className="text-richblack-100">{description1}</span>{" "}
              <span className="font-edu-sa font-bold italic text-blue-100">
                {description2}
              </span>
            </p>
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </div>
          <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0">
            <img
              src={frameImg}
              alt="Pattern"
              width={558}
              height={504}
              loading="lazy"
            />
            <img
              src={image}
              alt="Students"
              width={558}
              height={504}
              loading="lazy"
              className="absolute -top-4 right-4 z-10"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Template