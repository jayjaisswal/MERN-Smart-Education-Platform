import { Edit, User, Mail, Phone, Calendar, Heart, CheckCircle } from "lucide-react"
// ........................................
// import { Edit, User, Mail, Phone, Calendar, Heart, CheckCircle } from "lucide-react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../common/IconBtn"

// IconBtn component (assuming it exists)
// const IconBtn = ({ text, onclick, children, className = "" }) => (
//   <button
//     onClick={onclick}
//     className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${className}`}
//   >
//     {children}
//     {text}
//   </button>
// )



export default function MyProfile() {
 const { user } = useSelector((state) => state.profile)
   const navigate = useNavigate()
  const profileFields = [
    {
      icon: User,
      label: "First Name",
      value: user?.firstName,
      fallback: "Add First Name"
    },
    {
      icon: User,
      label: "Last Name", 
      value: user?.lastName,
      fallback: "Add Last Name"
    },
    {
      icon: Mail,
      label: "Email",
      value: user?.email,
      fallback: "Add Email"
    },
    {
      icon: Phone,
      label: "Phone Number",
      value: user?.additionalDetails?.contactNumber,
      fallback: "Add Contact Number"
    },
    {
      icon: Heart,
      label: "Gender",
      value: user?.additionalDetails?.gender,
      fallback: "Add Gender"
    },
    {
      icon: Calendar,
      label: "Date Of Birth",
      value: formattedDate(user?.additionalDetails?.dateOfBirth),
      fallback: "Add Date Of Birth"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-richblack-900 via-richblack-800 to-richblack-900 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center md:text-left px-2">
          <h1 className="bg-gradient-to-r from-blue-200 via-caribbeangreen-200 to-yellow-50 bg-clip-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-richblack-200 text-sm sm:text-base md:text-lg">Manage your personal information</p>
        </div>

        {/* Profile Header Card */}
        <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-richblack-800/90 to-richblack-700/90 backdrop-blur-xl border border-richblack-600 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-caribbeangreen-400/5 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-6 md:gap-8 lg:justify-between">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-caribbeangreen-300 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img
                    src={user?.image || "https://via.placeholder.com/120/118AB2/ffffff?text=Profile"}
                    alt={`profile-${user?.firstName}`}
                    className="relative aspect-square w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-3 sm:border-4 border-richblack-600 shadow-xl"
                  />
                  <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-caribbeangreen-300 rounded-full border-2 sm:border-3 md:border-4 border-richblack-800 flex items-center justify-center">
                    <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-richblack-900" />
                  </div>
                </div>
                
                <div className="text-center sm:text-left space-y-1 sm:space-y-2 flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-richblack-5 break-words">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : "Welcome User"
                    }
                  </h2>
                  <p className="text-richblack-200 text-sm sm:text-base md:text-lg flex items-center gap-2 justify-center sm:justify-start break-all">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{user?.email || "user@example.com"}</span>
                  </p>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-richblack-300 justify-center sm:justify-start">
                    <div className="w-2 h-2 bg-caribbeangreen-300 rounded-full animate-pulse flex-shrink-0"></div>
                    <span>Active now</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 w-full sm:w-auto mt-4 lg:mt-0">
                <IconBtn
                  text="Edit Profile"
                  onclick={() => navigate("/dashboard/settings")}
                  className="bg-gradient-to-r from-blue-400 to-caribbeangreen-300 hover:from-blue-300 hover:to-caribbeangreen-200 text-richblack-900 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 w-full sm:w-auto justify-center"
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </IconBtn>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-richblack-800/90 to-richblack-700/90 backdrop-blur-xl border border-richblack-600 shadow-2xl hover:shadow-caribbeangreen-500/10 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-caribbeangreen-400/5 via-blue-400/5 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-richblack-5 flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-r from-caribbeangreen-400 to-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-richblack-900" />
                </div>
                About
              </h3>
              <IconBtn
                text="Edit"
                onclick={() => navigate("/dashboard/settings")}
                className="bg-richblack-700 hover:bg-richblack-600 text-richblack-5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300 border border-richblack-600 hover:border-richblack-500 text-sm"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
              </IconBtn>
            </div>
            
            <div className="relative">
              <p className={`text-sm sm:text-base md:text-lg leading-relaxed break-words ${
                user?.additionalDetails?.about
                  ? "text-richblack-100"
                  : "text-richblack-300 italic"
              }`}>
                {user?.additionalDetails?.about || "Write something about yourself to let others know who you are..."}
              </p>
              {!user?.additionalDetails?.about && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-richblack-300/10 to-transparent animate-pulse rounded"></div>
              )}
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-richblack-800/90 to-richblack-700/90 backdrop-blur-xl border border-richblack-600 shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-pink-400/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-richblack-5 flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-r from-yellow-50 to-pink-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-richblack-900" />
                </div>
                Personal Details
              </h3>
              <IconBtn
                text="Edit"
                onclick={() => navigate("/dashboard/settings")}
                className="bg-richblack-700 hover:bg-richblack-600 text-richblack-5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-300 border border-richblack-600 hover:border-richblack-500 text-sm"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
              </IconBtn>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {profileFields.map((field, index) => {
                const IconComponent = field.icon
                return (
                  <div
                    key={field.label}
                    className="group/item relative overflow-hidden rounded-lg sm:rounded-xl bg-richblack-700/50 backdrop-blur border border-richblack-600/50 p-3 sm:p-4 md:p-6 hover:bg-richblack-700/80 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="absolute top-0 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-blue-300 via-caribbeangreen-300 to-yellow-50 transform scale-x-0 group-hover/item:scale-x-100 transition-transform duration-300"></div>
                    
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-r from-richblack-600 to-richblack-500 rounded-lg flex items-center justify-center group-hover/item:from-blue-400 group-hover/item:to-caribbeangreen-300 transition-all duration-300">
                        <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-richblack-200 group-hover/item:text-richblack-900 transition-colors duration-300" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-richblack-300 mb-1 sm:mb-2 uppercase tracking-wide">
                          {field.label}
                        </p>
                        <p className={`text-xs sm:text-sm md:text-base font-semibold break-words ${
                          field.value ? "text-richblack-5" : "text-richblack-400 italic"
                        }`}>
                          {field.value || field.fallback}
                        </p>
                      </div>
                    </div>
                    
                    {!field.value && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 sm:py-6 md:py-8">
          <p className="text-richblack-400 text-xs sm:text-sm">
            Keep your profile updated to help others connect with you
          </p>
        </div>
      </div>
    </div>
  )
}