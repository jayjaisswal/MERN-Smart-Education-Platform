import React from 'react';
import HighlightText from './HighlightText';
import Know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from './Button';

const LearningLanguageSection = () => {
    return (
        <div className='mt-[150px] mb-32'>
            <div className='flex flex-col items-center gap-5'>
                <div className='text-4xl font-semibold text-center '>
                    Your Swiss Knif For 
                    <HighlightText text='Learning Any Programming Language' />     
                </div>

                <div className='text-center text-richblack-600 mx-auto text-base font-medium w-[70%]'>
                    Using spin making learning multiple languages easy. with 20+ languages realistic voice—over,
                    progress tracking, custom schedule and more.
                </div>

                <div className='hidden lg:flex flex-row items-center justify-center mt-5 '>
                    <img 
                    src={Know_your_progress} 
                    alt="Know_your_progresss"
                    className='object-contain -mr-32'
                     />
                    <img 
                    src={compare_with_others} 
                    alt="compare_with_others"
                    className='object-contain'
                     />
                    <img 
                    src={plan_your_lesson} 
                    alt="plan_your_lesson"
                    className='object-contain -ml-36'
                     />

                </div>

                <div className='w-fit'>
                <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
                </div>

            </div>
        </div>
    );
};

export default LearningLanguageSection;