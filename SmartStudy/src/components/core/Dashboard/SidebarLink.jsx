import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"

import { resetCourseState } from "../../../slices/courseSlice"

export default function SidebarLink({ link, iconName }) {
  const Icon = Icons[iconName]
  const location = useLocation()
  const dispatch = useDispatch()

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  const isActive = matchRoute(link.path)

  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())}
      className={`
        group relative block mx-2 my-1 rounded-lg
        transition-all duration-300 ease-in-out
        transform hover:scale-[1.02] active:scale-[0.98]
        ${isActive 
          ? "bg-richblack-700 shadow-lg shadow-richblack-700/30" 
          : "hover:bg-richblack-700/50"
        }
      `}
    >
      {/* Active Indicator */}
      <div
        className={`
          absolute left-0 top-0 bottom-0 w-1 rounded-r-full
          transition-all duration-300 ease-out
          ${isActive 
            ? "bg-white shadow-md shadow-white/20" 
            : "bg-richblack-400 scale-y-0 group-hover:scale-y-75 group-hover:bg-richblack-200"
          }
        `}
      />

      {/* Content Container */}
      <div className="flex items-center px-6 py-3">
        {/* Icon Container */}
        <div className={`
          flex-shrink-0 relative transition-all duration-300 ease-out
          ${isActive 
            ? "text-white scale-110" 
            : "text-richblack-300 group-hover:text-richblack-100 group-hover:scale-105"
          }
        `}>
          <Icon className="text-lg" />
          
          {/* Icon Glow Effect */}
          <div className={`
            absolute inset-0 transition-all duration-300 ease-out pointer-events-none
            ${isActive 
              ? "text-white blur-sm opacity-20 scale-150" 
              : "text-richblack-100 blur-sm opacity-0 scale-100 group-hover:opacity-10 group-hover:scale-125"
            }
          `}>
            <Icon className="text-lg" />
          </div>
        </div>

        {/* Text Container */}
        <span className={`
          ml-3 relative transition-all duration-300 ease-out text-sm font-medium
          ${isActive 
            ? "text-richblack-5 font-semibold" 
            : "text-richblack-300 group-hover:text-richblack-50 group-hover:font-medium"
          }
        `}>
          {link.name}
          
          {/* Text Underline Effect */}
          <span className={`
            absolute bottom-0 left-0 h-px bg-richblack-100
            transition-all duration-300 ease-out
            ${isActive 
              ? "w-full opacity-60" 
              : "w-0 opacity-0 group-hover:w-full group-hover:opacity-40"
            }
          `} />
        </span>
      </div>

      {/* Hover Overlay */}
      <div className={`
        absolute inset-0 rounded-lg transition-all duration-300 ease-out pointer-events-none
        ${isActive 
          ? "bg-gradient-to-r from-richblack-600/20 to-richblack-500/10" 
          : "bg-richblack-600/0 group-hover:bg-richblack-600/30"
        }
      `} />

      {/* Click Ripple Effect */}
      <div className="
        absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200
        bg-white/5 group-active:opacity-100
      " />

      {/* Subtle Border */}
      <div className={`
        absolute inset-0 rounded-lg border transition-all duration-300
        ${isActive 
          ? "border-richblack-600/40" 
          : "border-transparent group-hover:border-richblack-600/30"
        }
      `} />
    </NavLink>
  ) 
}