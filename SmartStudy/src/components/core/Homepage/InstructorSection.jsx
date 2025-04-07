import React from 'react';
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText';
import CTAButton from './Button';
import { FaArrowRightFromBracket } from "react-icons/fa6";

const InstructorSection = () => {
    return (
        <div className='mt-16'>
            <div className='flex flex-row gap-20 items-center'>
                <div className='w-[50%]'>
                    <img src={Instructor} 
                    alt="Instructor"
                    className='shadow-white' />

                </div>
                <div className='w-[50%] flex flex-col gap-10'>
                    <div className='text-4xl font-semibold '>
                        Become an 
                        <HighlightText text={"Instructor"}/>
                        
                    </div>
                    <p className='font-medium text-[16px] w-[90%] text-richblack-300 text-justify'>
                        Instructors from aroun the world teach millions of students on StudyNotion. We provide the
                        tools and skills to teach what you love.
                    </p>

                   
                   <div className='w-fit'>
                        <CTAButton linkto={"/singup"} active={true}>
                                <div className='flex flex-row gap-2 items-center text-black'>
                                    Start Learning Today
                                    <FaArrowRightFromBracket/>

                                </div>
                        </CTAButton>

                   </div>
                    
                    




                </div>

            </div>
        </div>
    );
};

export default InstructorSection;