export default function IconBtn({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses = "",
  type = "button",
}) {
  return (
    <button
      disabled={disabled}
      onClick={onclick}
      type={type}
            className="bg-gradient-to-r from-blue-400 to-caribbeangreen-300 
  hover:from-blue-300 hover:to-caribbeangreen-200 
  text-richblack-900 px-5 py-3 
  text-base flex items-center justify-center 
  cursor-pointer rounded-md font-medium 
  transition-all duration-300 transform 
  shadow-lg hover:shadow-blue-500/25 
  w-full sm:w-auto gap-1 min-w-[120px]"

      // className={`flex items-center gap-x-2 rounded-xl px-5 bg-gradient-to-r from-blue-400 to-caribbeangreen-300 py-2 text-richblack-900 font-semibold transition-all duration-300
      //   ${
      //     outline
      //       ? "border border-caribbeangreen-200 bg-transparent text-caribbeangreen-200 hover:bg-caribbeangreen-900 hover:text-white"
      //       : "bg-caribbeangreen-200 text-richblack-900 hover:bg-caribbeangreen-300"
      //   }
      //   ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
      //   ${customClasses}`}
    >
      {children ? (
        <>
          <span>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
    </button>
  );
}
