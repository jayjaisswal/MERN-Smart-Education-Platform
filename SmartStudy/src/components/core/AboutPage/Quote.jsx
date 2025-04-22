import React from 'react';
import HighlightText from "../Homepage/HighlightText"

const Quote = () => {
    return (
        <div>
            We are passionate about revolutionizing the way we learn. Our innovative platform
            <HighlightText text="Combine Technology"></HighlightText>

            <span className='text-orange-400'>
                {" "}
                expertise
            </span>
            , and conunity to create an
            <span>
            unparalleled educational experience.
            </span>
        </div>
    );
};

export default Quote;