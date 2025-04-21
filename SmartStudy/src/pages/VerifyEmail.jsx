import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../services/operations/authAPI";
import { Link } from "react-router-dom";
import {signUp} from '../services/operations/authAPI'
const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const { signupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    if(!signupData){
        navigate("/signup");
    }

  }, [])
  const handleOnSubmit = (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;


    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };
  return (
    <div className="text-white">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>Verify Email</h1>
          <p>verification code has been sent to you. Enter the code below</p>
          <form onSubmit={handleOnSubmit} action="">
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input {...props} placeholder="-" />}
            />
            <button type="submit">Verify Email</button>
          </form>

          <div>
            <div>
              <Link to="/login">Back to login</Link>
            </div>
            <button onClick={()=>dispatch(sendOtp(signupData.email, navigate))}>Resend it</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
