import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../services/operations/SettingsAPI"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <div className="my-10 w-full rounded-md border border-pink-700 bg-pink-900 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
        {/* Icon Circle */}
        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-pink-700 flex-shrink-0">
          <FiTrash2 className="text-2xl sm:text-3xl text-pink-100" />
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-3 text-pink-50">
          <h2 className="text-lg sm:text-xl font-semibold text-richblack-5">
            Delete Account
          </h2>

          <div className="text-sm sm:text-base text-pink-200 max-w-xl leading-relaxed">
            <p className="mb-1">Would you like to delete your account?</p>
            <p>
              This account may contain paid courses. Deleting your account is
              permanent and will remove all associated content. This action
              cannot be undone.
            </p>
          </div>

          <button
            type="button"
            className="mt-2 w-fit text-sm italic text-pink-300 underline underline-offset-2 hover:text-pink-100 transition"
            onClick={handleDeleteAccount}
          >
            I want to delete my account.
          </button>
        </div>
      </div>
    </div>
  )
}
