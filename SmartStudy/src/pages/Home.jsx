import React from 'react';
import { FaArrowAltCircleRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/Homepage/HighlightText';
import CTAButton from '../components/core/Homepage/Button';
import Banner from '../assets/Images/vdo.mp4'
import CodeBlocks from '../components/core/Homepage/CodeBlocks';
import LearningLanguageSection from '../components/core/Homepage/LearningLanguageSection';
import TimelineSection from '../components/core/Homepage/TimelineSection';
import InstructorSection from '../components/core/Homepage/InstructorSection';
import ExploreMore from '../components/core/Homepage/ExploreMore';
import Footer from '../components/common/Footer';
import { TypeAnimation } from 'react-type-animation';
const Home = () => {
    return (
        <div>
            
            {/* Section 1 */}
            <div className='relative mx-auto max-w-max-content flex flex-col w-11/12 items-center text-white justify-between'>
                    {/* Section 1.1 */}
                    <Link to={'/signup'}>
                        <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
                                        transition-all duration-300 hover:scale-95'>
                            <div className='flex items-center gap-2 rounded-full px-10 py-[5px]
                                            transition-all duration-200 group-hover:bg-richblack-900' >
                                <p>Become an Instructor</p>
                                <FaArrowAltCircleRight />
                            </div>
                        </div>
                    </Link>

                    {/* Section 1.2 */}
                    <div className='text-center text-4xl font-semibold mt-7'>
                        Empower Your Future with  
                        <HighlightText text={"Coding Skills"}/>
                    </div>

                    {/* Section 1.3 */}
                    <div className=' mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
                        With our online coding courses, you can learn at your own pace, from anywhere in the world, 
                        and get access to a wealth of resources, including hands-on projects, quizzes, and personalized 
                        feedback from instructors.
                    </div>

                    {/* Section 1.4 */}
                    <div className='flex gap-7 mt-13'>
                            <CTAButton active={true} linkto={"/signup"} text={"Learn More"}></CTAButton>
                            <CTAButton active={false} linkto={"/login"}>Book a Demo</CTAButton>
                    </div>

                    <div className='mt-5 font-bold text-blue-200 lg:text-[2rem] text-[1rem]'>
                    <TypeAnimation
                        
                        sequence={[
                            "Learn Web Development from Experts",
                            1000,
                            "Master Data Structures & Algorithms",
                            1000,
                            "Crack Interviews with Confidence",
                            1000,
                            "Build Real-World Projects Hands-On",
                            1000,
                            "Upskill with Industry-Relevant Courses",
                            1000,
                          ]}
                          
                            speed={50}
                            // style={{ fontSize: '1em' }}
                            repeat={Infinity}
                            omitDeletionAnimation={true}
                            />
                    </div>

                    {/* Section 1.5 */}
                    <div className='mx-3 my-8 shadow-blue-200 '>
                        <video
                        muted
                        loop
                        autoPlay>
                        <source src={Banner} type="video/mp4" />
                        </video>
                    </div>

                    {/* code section 1.6 */}
                    <div className='hidden sm:block'>
                        <CodeBlocks
                                position={"sm:flex-row "}
                                heading={
                                            <div className='text-4xl font-semibold'>
                                                    Unlock Your
                                                    <HighlightText text={"Coding Potential "}/>
                                                    With our Online Courses
                                            </div>
                                        }
                                subHeading={
                                                "our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                                            }
                                ctabtn1 = {
                                                {
                                                    btntext: "Try it Yourself",
                                                    linkto: "/signup",
                                                    active: true,
                                                }
                                            }
                                ctabtn2 = {
                                                {
                                                    btntext: "Learn More",
                                                    linkto: "/login",
                                                    active: false,
                                                }
                                           }

                                           codeblock={`<<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\n`}
                                           codeColor={"text-yellow-25"}
                        
                        ></CodeBlocks>
                    </div>
                    {/* code section 1.7 */}
                    <div className=''>
                        <CodeBlocks
                        position={"sm:flex-row-reverse flex-col"}
                        heading={
                            <div className='text-4xl font-semibold hidden sm:block'>
                                Unlock Your
                                <HighlightText text={"Coding Potential"}/>
                                With our Online Courses
                            </div>
                        }
                        subHeading={
                            "our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                        }
                        ctabtn1 = {
                           {
                            btntext: "Try it Yourself",
                            linkto: "/signup",
                            active: true,
                           }
                        }
                        ctabtn2 = {
                           {
                            btntext: "Learn More",
                            linkto: "/login",
                            active: false,
                           }
                        }

                        
                codeblock={`#include<iostream>\nusing namespace std;\nint main() {\n cout<<"Hello Padhlo India";\nreturn 0;\n}\n`}
                codeColor={"text-yellow-25"}
                        
                        ></CodeBlocks>
                    </div>

                    {/* code section 1.8  */}
                    <div>
                       <ExploreMore/> 
                    </div>

            </div>

            {/* Section 2 */}
            <div className='bg-pure-greys-5 text-richblack-700'>
                {/* Section 2.1 */}
                <div className='homepage-bg h-[300px] '>
                        <div className='h-[150px]'></div>
                        <div className='w-11/12  max-w-max-content flex flex-col items-center gap-5 mx-auto'>
                            <div className='flex flex-row gap-7 text-white mt-10'>
                                    <CTAButton active={true} linkto={"/signup"}>
                                        <div className='flex items-center gap-2 '>
                                            Explore Full Catelog
                                            <FaArrowAltCircleRight/>
                                        </div>    
                                    </CTAButton>

                                    <CTAButton active={false} linkto={"/signup"}>
                                        <div >
                                            Learn More
                                        </div>    
                                    </CTAButton>
                            </div>
                        </div>
                    </div>
                        

                {/* Section 2.2*/}
                <div className='mx-auto w-11/12 max-w-max-content flex flex-col items-center  gap-7 '>
                    <div className='flex flex-row justify-between mt-10 mb-10'>
                                <div className='text-4xl font-semibold w-[45%]'>
                                    Get the Skills You Need For a
                                    <HighlightText text={"Job that is in Demand"}/>
                                </div>   
                       

                                <div className='flex flex-col gap-10 w-[40%] items-start' >
                                    <div className='text-[16px] '>
                                        The modern PadhloIndia is the dictates its own terms. Today, to be a competitive
                                        specialist requires more than professional skills.
                                    </div>
                                    <CTAButton active={true} linkto={"/singup"}> Learn More</CTAButton>
                                </div>
                    </div>
                    <TimelineSection/>
                    <LearningLanguageSection/>                  
                </div>              
                        
            </div>
   
            {/* Section 3 */}

            <div className='w-11/12 mx-auto max-w-max-content flex-col items-center justify-between gap-8 bg-richblack-900 text-white '>

                    <InstructorSection/>
                    <h2 className='text-center text-4xl font-semibold mt-10'>Review from other Learner</h2>
                    {/* Review Slider */}

            </div>


            {/* Section 4 Footer*/}
            <Footer/>
            
        </div>
    );
};

export default Home;