import React, { useState } from 'react';
import {useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { getPasswordResetToken } from '../services/operations/authAPI';

const ForgetPassword = () => {
    const [emailSent, setEmailSent] = useState(false);
    const [email, setEmail] = useState("");
    const {loading} = useSelector((state)=> state.auth)
    const dispatch = useDispatch();
    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent));

    }
    return (
        <div className='text-white flex flex-col items-center justify-center'>
            {
                loading?(<div>Loading...</div>)
                :(
                    <div>
                        <h1>
                            {!emailSent? "Reset Your Password":"Check Your Email"}
                        </h1>

                        <p>
                            {
                                !emailSent?
                                 "Have no fear. we'll email you instructions to reset your password. If you don't have access to your email we can try account recovery" 
                                 : `we have sent the reset email to ${email}`
                            }
                        </p>

                        <form onSubmit={handleOnSubmit}>
                            {
                                !emailSent && (
                                    <label>
                                        <p>Email Address*</p>
                                        <input 
                                            type="email"
                                            required
                                            value={email}
                                            name="email"
                                            onChange={(e)=> setEmail(e.target.value)}
                                            placeholder='Enter Your Email Address'
                                             />
                                    </label>
                                )
                            }

                            <button type='submit'>
                                {
                                    !emailSent? "Reset Password" : "Resend Email"
                                }
                            </button>
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

export default ForgetPassword;