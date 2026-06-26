import React, { useState, useEffect , useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import axios from 'axios';

const EmailVerification = () => {
  const [status, setStatus] = useState(null);
  const { emailVerificationToken } = useParams();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    const verifyEmail = async () => {
      hasFetched.current = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/email-verification/${emailVerificationToken}`);
        setStatus(response?.status)
      } catch (error) {
        const errorStatus = error.response?.status || 400;
        setStatus(errorStatus);
      }
    }
    
    if(emailVerificationToken){
      verifyEmail();
    }
  }, [emailVerificationToken])


  const messageSuccess = {
    statusText: "Email verified successfully",
    buttonText: "Go back to login"
  }

  const messageFaliure = {
    statusText: "Unable to verify your mail , Please try again",
    buttonText: "Go back to signup",
    reason: "Either Token is expired or you entered email was wrong"
  }

  if (status === null) {
    return (
      <div className='max-w-6xl flex flex-col items-center m-6 gap-y-13 mt-36'>
        <h1 className='sm:text-3xl text-lg font-semibold text-gray-400'>Verifying your email...</h1>
      </div>
    )
  }

  return (
    <>
      {
        (status === 200) ? (<div className='max-w-6xl flex flex-col items-center m-6 gap-y-13 mt-36'>
          <h1 className='sm:text-4xl text-2xl font-semibold text-green-400'>{messageSuccess.statusText}</h1>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className='bg-[#6e9f6c] text-white font-semibold sm:text-lg sm:p-3 p-1.5 rounded-xl '
          >
            {messageSuccess.buttonText}
          </motion.button>
        </div>) : (<div className='max-w-6xl flex flex-col items-center m-6 gap-y-13 mt-36'>
          <h1 className='sm:text-4xl text-2xl font-semibold text-red-400 text-center'>{messageFaliure.statusText}</h1>
          <p className='text-md text-center'>{messageFaliure.reason}</p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/signup')}
            className='bg-[#d64040] text-white font-semibold sm:text-lg sm:p-3 p-1.5 rounded-xl '
          >
            {messageFaliure.buttonText}
          </motion.button>
        </div>)
      }
    </>
  )
}

export default EmailVerification
