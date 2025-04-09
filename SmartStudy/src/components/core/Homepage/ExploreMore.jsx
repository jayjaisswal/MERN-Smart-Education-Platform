import React from 'react';
import {HomePageExplore} from "../../../data/homepage-explore"
import HighlightText from './HighlightText';
import { useState } from 'react';
import CourseCard from './CourseCard';

const tabsName = [
    "Free",
    "New to coding",
    "Most popular ",
    "Skills paths",
    "Career paths"
]

const ExploreMore = () => {

    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourse] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading)

    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course)=> course.tag === value);
        setCourse(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);

    }


    
    return (
        <div>

            <div className='font-medium text-4xl text-center'>
                Unlock the 
                <HighlightText text={"Power Of Code"}/>  
            </div>

            <p className='text-richblack-300 text-center mt-3 text-[16px]    '>
                Learn to build anything you can imagine
            </p>

            <div className='flex flex-row rounded-full bg-richblack-800 mb-5  mt-5 px-1 py-1'>
                {
                    tabsName.map((tab, index) => {
                        return (
                            <div key={index} className={`text-[16px] flex flex-row items-center gap-2
                            ${currentTab===tab
                                ?"bg-richblack-900 text-richblack-5 font-medium" 
                                :"text-richblack-200 font-medium"} rounded-full transition-full duration-200 cursor-pointer
                                hover:bg-richblack-900 hover:text-richblack-5 py-2 px-4`}
                                onClick={()=> setMyCards(tab)}>
                                {tab}
                            </div>
                        )
                    })
                }
            </div>


            <div>
                <div className='lg:h-[150px]'></div>

                {/* course Card  */}
                <div className='absolute flex flex-row gap-10 justify-between w-full '>
                    {
                        courses.map((course, index) => {
                            return (
                                <CourseCard
                                key={index}
                                cardData = {course}
                                currentCard={currentCard}
                                setCurrentCard={setCurrentCard}
                                
                                />
                            )

                        })
                    }
                </div>
            </div>




        </div>
    );
};

export default ExploreMore;