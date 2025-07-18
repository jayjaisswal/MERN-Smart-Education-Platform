import { useState, useEffect } from "react"
import { VscSignOut, VscThreeBars, VscChromeClose } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from "../../common/ConfirmationModal"
import SidebarLink from "./SidebarLink"
import Spinner from "../../../spinner/Spinner"

export default function Sidebar() {
  const { user } = useSelector((state) => state.profile)
  const { loading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  // Handle body scroll lock when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isSidebarOpen])

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-1 px-2 flex-1">
        {sidebarLinks.map((link) => {
          if (link.type && user?.accountType !== link.type) return null
          return (
            <SidebarLink
              key={link.id}
              link={link}
              iconName={link.icon}
            />
          )
        })}
      </div>

      <div className="mx-auto mt-6 mb-6 h-[1px] w-11/12 " />

      <div className="flex flex-col gap-1 px-2">
        <SidebarLink
          link={{ name: "Settings", path: "/dashboard/settings" }}
          iconName="VscSettingsGear"
        />

        <button
          onClick={() =>
            setConfirmationModal({
              text1: "Are you sure?",
              text2: "You will be logged out of your account.",
              btn1Text: "Logout",
              btn2Text: "Cancel",
              btn1Handler: () => dispatch(logout(navigate)),
              btn2Handler: () => setConfirmationModal(null),
            })
          }
          className="flex items-center gap-x-2 px-6 py-2 text-sm font-medium text-richblack-300 hover:bg-richblack-700 hover:text-richblack-5 transition-all duration-200 rounded-md"
        >
          <VscSignOut className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"><Spinner></Spinner></div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile Menu Button - Floating */}
      <button 
        onClick={() => setIsSidebarOpen(true)} 
        className="md:hidden fixed top-20 left-4 z-30  text-richblack-100 hover:text-richblack-5 p-3 rounded-lg hover:bg-richblack-700 transition-all duration-200 shadow-lg border border-richblack-600"
      >
        <VscThreeBars className="text-xl" />
      </button>

      {/* Desktop Sidebar */} 
      <div className="hidden md:flex h-[calc(100vh-3.5rem)] min-w-[220px] lg:min-w-[240px] flex-col border-r-[1px] border-r-richblack-700  py-10">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-[280px] 
        bg-richblack-800 border-r border-richblack-700 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
      `}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-richblack-700">
          <h2 className="text-richblack-5 text-lg font-semibold">Menu</h2>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="text-richblack-100 hover:text-richblack-5 p-2 rounded-md hover:bg-richblack-700 transition-all duration-200"
          >
            <VscChromeClose className="text-lg" />
          </button>
        </div>
        <div className="py-6 h-[calc(100%-80px)]">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}