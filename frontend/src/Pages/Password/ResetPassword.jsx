import React, { useState } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { toast } from "react-toastify"
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
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password/${resetPasswordToken}`, {
        "newPassword": newPassword,
        "confirmNewPassword": confirmNewPassword
      });

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
    <section className='w-screen h-[calc(100vh-66px-120px)] flex items-center justify-center px-4'>
      <form
        onSubmit={handleResetPassword}
        className="w-full max-w-sm flex flex-col items-center gap-y-5 bg-white dark:bg-black/20 rounded-xl p-6 sm:p-8"
      >
        <h1 className="text-2xl sm:text-3xl font-semibold text-center">Reset Password</h1>
        <div className="w-full flex flex-col gap-y-1">
          <label htmlFor="newPassword" className="text-sm font-medium dark:text-white/80 text-black/80">
            New password
          </label>
          <div className="relative w-full">
            <input
              id="newPassword"
              type={passwordToogle ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-3 py-2 pr-10 rounded-lg bg-transparent border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setPasswordToogle(!passwordToogle)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50"
            >
              {passwordToogle ? <EyeIcon size={18} /> : <EyeClosedIcon size={18} />}
            </button>
          </div>
        </div>

        <div className="w-full flex flex-col gap-y-1">
          <label htmlFor="confirmNewPassword" className="text-sm font-medium dark:text-white/80 text-black/80">
            Confirm new password
          </label>
          <div className="relative w-full">
            <input
              id="confirmNewPassword"
              type={passwordToogle ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3 py-2 pr-10 rounded-lg bg-transparent border border-black/20 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setPasswordToogle(!passwordToogle)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50"
            >
              {passwordToogle ? <EyeIcon size={18} /> : <EyeClosedIcon size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-2 rounded-lg font-semibold text-white transition ${isFormValid
              ? "bg-[#5fa2fa] hover:bg-[#4b8ee6]"
              : "bg-[#5fa2fa]/40 cursor-not-allowed"
            }`}
        >
          Reset
        </button>
      </form>
    </section>
  )
}

export default ResetPassword;
