import { useRef, useState } from "react"
import { AiOutlineCaretDown } from "react-icons/ai"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import useOnClickOutside from "../../../hooks/useOnClickOutside"
import { logout } from "../../../services/operations/authAPI"

export default function ProfileDropdown({ onAction }) {
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpen(false))

  if (!user) return null

  return (
    <button className="relative" onClick={() => setOpen((prev) => !prev)}>
      <div className="flex items-center gap-x-1 ml-4 mb-2 ">
        <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[30px] rounded-full object-cover "
        />
        <AiOutlineCaretDown className="text-sm text-richblack-100" />
      </div>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          ref={ref}
          className={`
            absolute z-[1000]
            left-2/7 -translate-x-1/2 top-[118%]
            w-54 max-w-[90vw] mr-2
            divide-y-[1px] divide-richblack-700
            overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800 shadow-lg
            md:w-56 md:max-w-none  md:left-auto md:right-0 md:translate-x-0 md:mr-0
          `}
        >
          <Link
            to="/dashboard/my-profile"
            onClick={() => {
              setOpen(false)
              if (onAction) onAction()
            }}
          >
            <div className="flex w-full items-center gap-x-2 py-3 px-4 text-base text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 transition-colors">
              <VscDashboard className="text-lg" />
              Dashboard
            </div>
          </Link>
          <div
            onClick={() => {
              dispatch(logout(navigate))
              setOpen(false)
              if (onAction) onAction()
            }}
            className="flex w-full items-center gap-x-2 py-3 px-4 text-base text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 transition-colors cursor-pointer"
          >
            <VscSignOut className="text-lg" />
            Logout 
          </div>
        </div>
      )}
    </button>
  )
}