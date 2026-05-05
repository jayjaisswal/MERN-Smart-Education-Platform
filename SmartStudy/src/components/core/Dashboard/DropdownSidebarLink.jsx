import { useState } from "react"
import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"
import { MdKeyboardArrowDown } from "react-icons/md"
import { resetCourseState } from "../../../slices/courseSlice"

export default function DropdownSidebarLink({ link, iconName }) {
    const Icon = Icons[iconName]
    const location = useLocation()
    const dispatch = useDispatch()
    const [isOpen, setIsOpen] = useState(false)

    const matchRoute = (route) => {
        return route && matchPath({ path: route }, location.pathname)
    }

    const isActive = link.path ? matchRoute(link.path) : false

    const handleDropdownClick = (e) => {
        e.preventDefault()
        setIsOpen(!isOpen)
    }

    if (link.isDropdown) {
        return (
            <div>
                <button
                    onClick={handleDropdownClick}
                    className={`w-full group relative block mx-2 my-1 rounded-lg text-left transition-all duration-300 ease-in-out ${isOpen
                            ? "bg-richblack-700 shadow-lg shadow-richblack-700/30"
                            : "hover:bg-richblack-700/50"
                        }`}
                >
                    <div
                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-300 ease-out ${isOpen
                                ? "bg-white shadow-md shadow-white/20"
                                : "bg-richblack-400 scale-y-0 group-hover:scale-y-75 group-hover:bg-richblack-200"
                            }`}
                    />

                    <div className="flex items-center justify-between px-6 py-3">
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex-shrink-0 relative transition-all duration-300 ease-out ${isOpen
                                        ? "text-white scale-110"
                                        : "text-richblack-300 group-hover:text-richblack-100 group-hover:scale-105"
                                    }`}
                            >
                                <Icon className="text-lg" />
                                <div
                                    className={`absolute inset-0 transition-all duration-300 ease-out pointer-events-none ${isOpen
                                            ? "text-white blur-sm opacity-20 scale-150"
                                            : "text-richblack-100 blur-sm opacity-0 scale-100 group-hover:opacity-10 group-hover:scale-125"
                                        }`}
                                >
                                    <Icon className="text-lg" />
                                </div>
                            </div>

                            <span
                                className={`relative transition-all duration-300 ease-out text-sm font-medium ${isOpen
                                        ? "text-richblack-5 font-semibold"
                                        : "text-richblack-300 group-hover:text-richblack-50 group-hover:font-medium"
                                    }`}
                            >
                                {link.name}
                                <span
                                    className={`absolute bottom-0 left-0 h-px bg-richblack-100 transition-all duration-300 ease-out ${isOpen
                                            ? "w-full opacity-60"
                                            : "w-0 opacity-0 group-hover:w-full group-hover:opacity-40"
                                        }`}
                                />
                            </span>
                        </div>

                        <div
                            className={`flex-shrink-0 transition-transform duration-300 ease-out ${isOpen ? "rotate-180" : "rotate-0"
                                } text-richblack-300 group-hover:text-richblack-100`}
                        >
                            <MdKeyboardArrowDown className="text-lg" />
                        </div>
                    </div>

                    <div
                        className={`absolute inset-0 rounded-lg transition-all duration-300 ease-out pointer-events-none ${isOpen
                                ? "bg-gradient-to-r from-richblack-600/20 to-richblack-500/10"
                                : "bg-richblack-600/0 group-hover:bg-richblack-600/30"
                            }`}
                    />
                </button>

                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"
                        }`}
                >
                    <div className="pl-4 space-y-1 py-2">
                        {link.subItems?.map((subItem) => (
                            <div key={subItem.id}>
                                {subItem.isDropdown ? (
                                    <DropdownSidebarLink
                                        link={subItem}
                                        iconName={subItem.icon}
                                    />
                                ) : (
                                    <NavLink
                                        to={subItem.path}
                                        onClick={() => {
                                            dispatch(resetCourseState())
                                            setIsOpen(false)
                                        }}
                                        className={`group relative block mx-2 my-1 rounded-lg transition-all duration-300 ease-in-out ${matchRoute(subItem.path)
                                                ? "bg-richblack-700 shadow-lg shadow-richblack-700/30"
                                                : "hover:bg-richblack-700/50"
                                            }`}
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-300 ease-out ${matchRoute(subItem.path)
                                                ? "bg-white shadow-md shadow-white/20"
                                                : "bg-richblack-400 scale-y-0 group-hover:scale-y-75 group-hover:bg-richblack-200"
                                            }`} />

                                        <div className="flex items-center px-6 py-2">
                                            <span
                                                className={`relative transition-all duration-300 ease-out text-sm font-medium ${matchRoute(subItem.path)
                                                        ? "text-richblack-5 font-semibold"
                                                        : "text-richblack-300 group-hover:text-richblack-50 group-hover:font-medium"
                                                    }`}
                                            >
                                                {subItem.name}
                                                <span
                                                    className={`absolute bottom-0 left-0 h-px bg-richblack-100 transition-all duration-300 ease-out ${matchRoute(subItem.path)
                                                            ? "w-full opacity-60"
                                                            : "w-0 opacity-0 group-hover:w-full group-hover:opacity-40"
                                                        }`}
                                                />
                                            </span>
                                        </div>
                                    </NavLink>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <NavLink
            to={link.path}
            onClick={() => dispatch(resetCourseState())}
            className={`group relative block mx-2 my-1 rounded-lg transition-all duration-300 ease-in-out ${isActive
                    ? "bg-richblack-700 shadow-lg shadow-richblack-700/30"
                    : "hover:bg-richblack-700/50"
                }`}
        >
            <div
                className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full transition-all duration-300 ease-out ${isActive
                        ? "bg-white shadow-md shadow-white/20"
                        : "bg-richblack-400 scale-y-0 group-hover:scale-y-75 group-hover:bg-richblack-200"
                    }`}
            />

            <div className="flex items-center px-6 py-3">
                <div
                    className={`flex-shrink-0 relative transition-all duration-300 ease-out ${isActive
                            ? "text-white scale-110"
                            : "text-richblack-300 group-hover:text-richblack-100 group-hover:scale-105"
                        }`}
                >
                    <Icon className="text-lg" />
                    <div
                        className={`absolute inset-0 transition-all duration-300 ease-out pointer-events-none ${isActive
                                ? "text-white blur-sm opacity-20 scale-150"
                                : "text-richblack-100 blur-sm opacity-0 scale-100 group-hover:opacity-10 group-hover:scale-125"
                            }`}
                    >
                        <Icon className="text-lg" />
                    </div>
                </div>

                <span
                    className={`ml-3 relative transition-all duration-300 ease-out text-sm font-medium ${isActive
                            ? "text-richblack-5 font-semibold"
                            : "text-richblack-300 group-hover:text-richblack-50 group-hover:font-medium"
                        }`}
                >
                    {link.name}
                    <span
                        className={`absolute bottom-0 left-0 h-px bg-richblack-100 transition-all duration-300 ease-out ${isActive
                                ? "w-full opacity-60"
                                : "w-0 opacity-0 group-hover:w-full group-hover:opacity-40"
                            }`}
                    />
                </span>
            </div>

            <div
                className={`absolute inset-0 rounded-lg transition-all duration-300 ease-out pointer-events-none ${isActive
                        ? "bg-gradient-to-r from-richblack-600/20 to-richblack-500/10"
                        : "bg-richblack-600/0 group-hover:bg-richblack-600/30"
                    }`}
            />
        </NavLink>
    )
}
