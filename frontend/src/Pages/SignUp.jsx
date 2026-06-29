import React, { useState, useEffect } from 'react';
import axios from "axios"
import { useNavigate } from "react-router-dom";
import AuthMarquee from "../components/AuthMarquee.jsx"
import logo from "../assets/logo.svg";
import { CheckCheck, EyeClosedIcon, EyeIcon } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';

const SignUp = () => {
  const [passwordToogle, setPasswordToogle] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [OTP, setOTP] = useState("");
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("pendingVerificationEmail");
    if (savedEmail) {
      setEmail(savedEmail)
      setStep(2);
    }
  }, [])


  const isFormValid = fullName.trim() !== "" && email.trim() !== "" && password.trim() !== "";
  const isOTPValid = OTP.trim() !== "" && OTP.length === 4;

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        "fullName": fullName,
        "email": email,
        "password": password
      });
      sessionStorage.setItem("pendingVerificationEmail", email);
      setStep(2);
      toast("verification email sent")
      setErrorMessage("Success");
    } catch (error) {
      if (error.response) {
        const backendMessage = error.response?.data?.message
        setErrorMessage(backendMessage)
        toast.error(backendMessage);
      } else if (error.request) {
        const networkMsg = "Network error. Please check your connection.";
        setErrorMessage(networkMsg);
        toast.error(networkMsg);
      } else {
        const unexpectedMsg = "An unexpected error occurred.";
        setErrorMessage(unexpectedMsg);
        toast.error(unexpectedMsg);
      }
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/verifyOTP`, {
        "email": email,
        "enteredOTP": OTP
      });
      sessionStorage.removeItem("pendingVerificationEmail");
      toast.success("Account verified successfully!");
      navigate('/onBoarding');
    } catch (error) {
      if (error.response) {
        const backendMessage = error.response?.data?.message || "Something went wrong";
        setErrorMessage(backendMessage);
        toast.error(backendMessage)
      } else if (error.request) {
        const networkMsg = "Network error. Please check your connection.";
        setErrorMessage(networkMsg);
        toast.error(networkMsg);
      } else {
        const unexpectedMsg = "An unexpected error occurred.";
        setErrorMessage(unexpectedMsg);
        toast.error(unexpectedMsg);
      }
    }
  };

  const handleChangeEmail = () => {
    sessionStorage.removeItem("pendingVerificationEmail");
    
    setEmail("");
    setPassword(""); 
    setOTP("");
    
    setStep(1); 
  };

  return (
    <section className='flex justify-center items-center w-full sm:h-[810px] md:h-[590px]'>
      <AuthMarquee />
      <span className='h-full w-1/2 flex justify-center items-center py-20'>
        {
          (step === 1) ? (
            <div className='w-lg h-[500px] sm:mb-0 mb-20'>
              <div className='flex items-center gap-x-2.5 mb-8 sm:pl-25 sm:pl-9 pl-18'>
                <img src={logo} width={45} />
                <h1 className='text-2xl font-semibold'>CineScope</h1>
              </div>

              <div className='space-y-1 mb-6'>
                <h1 className='sm:text-4xl text-2xl font-bold sm:text-left text-center sm:mb-0 mb-4'>Welcome to CineScope</h1>
                <p className='sm:text-lg dark:text-white/60 font-medium sm:text-left text-center text-black'>Register now to begin your cinematic journey</p>
              </div>

              <form onSubmit={handleRegistration} className='flex flex-col gap-y-4 sm:w-[80%] w-[100%]'>
                <div className='flex flex-col gap-y-1.5'>
                  <label htmlFor="fullName" className='text-sm font-medium dark:text-white/80 text-black'>Full name</label>
                  <input
                    onChange={(e) => setFullName(e.target.value)}
                    id="fullName"
                    type="text"
                    value={fullName}
                    placeholder='Jhon Doe'
                    className='ring-1 ring-slate-700 focus:ring-[#5fa2fa] focus:outline-none bg-transparent py-2.5 px-3 rounded-lg text-sm transition-all dark:text-white '
                  />
                </div>
                <div className='flex flex-col gap-y-1.5'>
                  <label htmlFor="email" className='text-sm font-medium dark:text-white/80'>Email</label>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    type="email"
                    value={email}
                    placeholder='johndoe@gmail.com'
                    className='ring-1 ring-slate-700 focus:ring-[#5fa2fa] focus:outline-none bg-transparent py-2.5 px-3 rounded-lg text-sm transition-all'
                  />
                </div>
                <div className='flex flex-col gap-y-1.5'>
                  <label htmlFor="password" className='text-sm font-medium dark:text-white/80'>Set password</label>
                  <div className='relative'>
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      type={passwordToogle ? "text" : "password"}
                      placeholder='••••••••'
                      className='w-full ring-1 ring-slate-700 focus:ring-[#5fa2fa] focus:outline-none bg-transparent py-2.5 pl-3 pr-10 rounded-lg text-sm transition-all'
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordToogle(!passwordToogle)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {passwordToogle ? <EyeIcon size={18} /> : <EyeClosedIcon size={18} />}
                    </button>
                  </div>
                </div>
                <button
                  disabled={!isFormValid}
                  type='submit'
                  className={`${isFormValid ? "bg-[#5fa2fa]" : "bg-[#5fa2fa] cursor-not-allowed"} hover:bg-blue-600 active:bg-blue-600 text-white font-semibold rounded-lg py-3 mt-2 transition-colors`}
                >
                  Register
                </button>
                <p className='text-center dark:text-white/60 text-sm'>
                  Already have an account?{' '}
                  <span onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate('/login');
                  }} className='text-[#5fa2fa] hover:text-blue-300 cursor-pointer transition-colors'>Log in</span>
                </p>
              </form>
            </div>
          ) : (
            <div className='w-lg h-[500px] sm:mb-0 mb-20 sm:mt-50'>
              <div className='space-y-4 mb-6'>
                <h1 className='sm:text-4xl text-2xl font-bold sm:text-left text-center sm:mb-0 mb-4'>Verify yourself</h1>
                <p className='sm:text-lg dark:text-white/60 font-medium sm:text-left text-center text-black'>Enter the 4 digit code sent to you</p>
              </div>

              <form onSubmit={handleVerifyOTP} className='flex flex-col gap-y-4 sm:w-[80%] w-[100%]'>
                <div className='flex flex-col gap-y-1.5'>
                  <label htmlFor="enteredOTP" className='text-sm font-medium dark:text-white/80 text-black'>OTP</label>
                  <input
                    onChange={(e) => setOTP(e.target.value)}
                    id="enteredOTP"
                    type="text"
                    value={OTP}
                    placeholder='XXXX'
                    className='ring-1 ring-slate-700 focus:ring-[#5fa2fa] focus:outline-none bg-transparent py-2.5 px-3 rounded-lg text-sm transition-all dark:text-white '
                  />
                </div>
                <button
                  disabled={!isOTPValid}
                  type='submit'
                  className={`${isOTPValid ? "bg-[#5fa2fa]" : "bg-[#5fa2fa] cursor-not-allowed"} hover:bg-blue-600 active:bg-blue-600 text-white font-semibold rounded-lg py-3 mt-2 transition-colors`}
                >
                  Submit
                </button>
                <p className='text-center dark:text-white/60 text-sm mt-2'>
                  Wrong email?{' '}
                  <span
                    onClick={handleChangeEmail}
                    className='text-[#5fa2fa] hover:text-blue-300 cursor-pointer transition-colors'
                  >
                    Change it here
                  </span>
                </p>
              </form>
            </div>)
        }
      </span>
    </section>
  )
}

export default SignUp
