import React from 'react';
import { Link } from 'react-router-dom';
const Button = ({children, active, linkto, text}) => {
    return (
       <Link to={linkto}>
        {/* "bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400  "
        "bg-gradient-to-r from-purple-500 to-pink-500 text-white" */}
            <div className={`text-center text-[14px] px-6 py-3 rounded-md font-bold
                            ${active? "bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 text-richblack-800  " :"bg-richblack-800 text-richblack-200"}
                            hover:scale-95 transition-all duration-200`}>
                    {text}{children}
            </div>
       </Link>
    );
};

export default Button;

