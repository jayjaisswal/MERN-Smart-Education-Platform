export default function Tab({ tabData, field, setField }) {
  return (
    <div
      // style={{
      //   boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)", // btn ke just niche wala border
      // }}
      className="flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max 
                  shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)]"
    >
      {tabData.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setField(tab.type)}
          className={`${
            field === tab.type
              ? "bg-richblack-900 text-richblack-5"
              : " text-richblack-200"
          } py-2 px-5 rounded-full transition-all duration-200 cursor-pointer`}
        >
          {tab?.tabName}
        </button>
      ))}
    </div>
  );
}
