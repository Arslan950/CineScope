import React, { useState } from 'react'
import { useParams , useNavigate } from "react-router-dom"
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import {toast} from "react-toastify"
import axios from 'axios';

const ResetPassword = () => {
  const [passwordToogle, setPasswordToogle] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { resetPasswordToken } = useParams();

  const isFormValid = newPassword.trim() !== "" && confirmNewPassword.trim() !== "";

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password/${resetPasswordToken}`,{
        "newPassword" : newPassword ,
        "confirmNewPassword" : confirmNewPassword
      });

      setErrorMessage("Success")
      toast("password updated Successfully !")
      navigate('/login');

    } catch (error) {
      if (error.response) {
        const backendMessage = error.response?.data?.message || "Invalid password. Please try again.";
        setErrorMessage(backendMessage);
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

  return (
    <section className='flex flex-col justify-center items-center w-full sm:h-[810px] md:h-[590px]'>
      <div className='space-y-1 mb-6'>
        <h1 className='text-4xl font-bold '>Reset password</h1>
      </div>
      <form onSubmit={handleResetPassword} className='flex flex-col gap-y-4 sm:w-[25%] w-[100%]'>
        <div className='flex flex-col gap-y-1.5'>
          <label htmlFor="password" className='text-sm font-medium dark:text-white/80'>Set new password</label>
          <div className='relative'>
            <input
              onChange={(e) => setNewPassword(e.target.value)}
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
        <div className='flex flex-col gap-y-1.5'>
          <label htmlFor="confirmPassword" className='text-sm font-medium dark:text-white/80'>Confirm password</label>
          <div className='relative'>
            <input
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              id="confirmPassword"
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
          Reset Password
        </button>
      </form>
    </section>
  )
}

export default ResetPassword ;
