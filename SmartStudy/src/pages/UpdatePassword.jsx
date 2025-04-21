import React, { useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link } from 'react-router-dom';
import {resetPassword} from "../services/operations/authAPI"

const UpdatePassword = () => {
    const dispatch = useDispatch();
    const location = useLocation()
    const {loading} = useSelector((state)=> state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        password:"",
        confirmPassword:""
    })

    const {password, confirmPassword} = formData;

    const handleOnChange = (e) =>{
        setFormData ((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }))
    }

    const handleOnSubmit =  (e) => {
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        const res =  dispatch(resetPassword(password, confirmPassword, token))

       
    }
    return (
        <div className='flex items-center justify-center text-white'>
            {
                loading? (
                    <div>Loading...</div>
                ):(
                    <div>
                        <h1>Choose new Password</h1>
                        <p>Almost done. Enter Your new Password and You are all set</p>
                        <form onSubmit={handleOnSubmit} action="">
                            <label htmlFor="">
                                <p>New Password*</p>
                                <input type={showPassword?"text":"password"}
                                name='password' 
                                value={password}
                                onChange={handleOnChange}
                                placeholder='Password'
                                 />
                                 <span 
                                 onClick={()=> setShowPassword((prev) => !prev)} >
                                    {
                                        showPassword?<FaEyeSlash fontSize={24}/>:<FaEye fontSize={24}/>


                                    }
                                 </span>
                            </label>
                            <label htmlFor="">
                                <p>Confirm Password*</p>
                                <input type={showConfirmPassword?"text":"password"}
                                name='confirmPassword' 
                                value={confirmPassword}
                                onChange={handleOnChange}
                                placeholder='Confirm Password'
                                 />
                                 <span 
                                 onClick={()=> setShowConfirmPassword((prev) => !prev)} >
                                    {
                                        showConfirmPassword?<FaEyeSlash fontSize={24}/>:<FaEye fontSize={24}/>


                                    }
                                 </span>
                            </label>
                            <button className='mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900' type='submit'>Reset Password</button>
                        </form>

                        <div>
                            <Link to={"/login"}>
                                <p>Back to Login</p>
                            </Link>
                        </div>

                    </div>
                )
            }
            
        </div>
    );
};

export default UpdatePassword;