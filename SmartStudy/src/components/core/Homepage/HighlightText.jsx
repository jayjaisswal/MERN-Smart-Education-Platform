import React from 'react';

const HighlightText = ({text}) => {
    return (
        // <span className='font-bold text-richblue-200 '>
        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            {" "}{text}{" "}
        </span>
    );
};

export default HighlightText;