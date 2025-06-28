import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"

export default function Settings() {
  return (
    <div className="w-full max-w-[900px] mx-auto px-4 py-8">
      <h1 className="mb-10 text-2xl sm:text-3xl font-semibold text-richblack-5 text-center sm:text-left">
        Edit Profile
      </h1>

      {/* Profile Picture - stack on mobile */}
      <div className="mb-8">
        <ChangeProfilePicture />
      </div>

      {/* Edit Profile Section */}
      <div className="mb-8">
        <EditProfile />
      </div>

      {/* Update Password */}
      <div className="mb-8">
        <UpdatePassword />
      </div>

      {/* Delete Account */}
      <div className="mb-8">
        <DeleteAccount />
      </div>
    </div>
  )
}
