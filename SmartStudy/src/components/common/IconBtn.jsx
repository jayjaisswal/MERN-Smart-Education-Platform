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
      className={`
        flex items-center justify-center gap-1
        rounded-md font-medium cursor-pointer
        bg-gradient-to-r from-blue-400 to-caribbeangreen-300 
        hover:from-blue-300 hover:to-caribbeangreen-200 
        text-richblack-900
        transition-all duration-300 transform 
        shadow-lg hover:shadow-blue-500/25

        /* Mobile first - small size */
        text-sm px-3 py-2 min-w-[100px]

        /* Tablet and up - medium size */
        md:text-base md:px-5 md:py-3 md:min-w-[120px]

        /* Handle disabled state */
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}

        /* Custom classes passed as prop */
        ${customClasses}
      `}
    >
      {children ? (
        <>
          <span className="truncate">{text}</span>
          {children}
        </>
      ) : (
        <span className="truncate">{text}</span>
      )}
    </button>
  );
}