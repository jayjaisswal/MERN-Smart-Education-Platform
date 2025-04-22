import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    console.log("Logging data",data);
    try{
        setLoading(true);
        const response = await apiConnector("POST",contactUsEndPoint.CONTACT_US_API, data );
        console.log("LoggingResponse data",response);
        setLoading(false);


    }catch(error){
        console.log("Error in Logging Form", error.message);
        setLoading(false);

    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form onSubmit={handleSubmit(submitContactForm)} action="">
      <div className="flex flex-col gap-3">
        <div className="flex gap-5">
          {/* firstName */}
          <div className="flex flex-col">
            <label htmlFor="firstName"> First Name</label>
            <input
              type="text"
              placeholder="firstName"
              name="firstName"
              id="firstName"
              {...register("firstName", { required: true })}
            />
            {errors.firstName && <span>Please Enter Your Name</span>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="lastName"> Last Name</label>
            <input
              type="text"
              placeholder="lastName"
              name="lastName"
              id="lastName"
              {...register("lastName")}
            />
          </div>
        </div>
        {/* email */}
        <div className="flex flex-col">
          <label htmlFor="email"> Email Address</label>
          <input
            type="email"
            placeholder="email"
            name="email"
            id="email"
            {...register("email", { required: true })}
          />
          {errors.email && <span>Please enter Your email Address</span>}
        </div>

        {/* message */}
        <div className="flex flex-col">
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
            placeholder="Write Your Message here"
            cols="30"
            rows="7"
            {...register("message", { required: true })}
          ></textarea>
          {errors.message && <span>Please Enter Your Message</span>}
        </div>
        <button
          className="rounded-md bg-yellow-100 text-center  text-[16px] font-bold text-black p-3"
          type="submit"
        >
          {" "}
          Send Message
        </button>
      </div>
    </form>
  );
};

export default ContactUsForm;
