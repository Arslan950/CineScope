import React, { useState } from 'react';
import axios from "axios"
import { useNavigate } from "react-router-dom"
import AuthMarquee from '../components/AuthMarquee';
import logo from "../assets/logo.svg";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
    const [passwordToogle, setPasswordToogle] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const isFormValid = email.trim() !== "" && password.trim() !== "";

    const handleLogIn = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
                "email": email,
                "password": password
            });
            navigate('/home');
        } catch (error) {
            if (error.response) {
                const backendMessage = error.response?.data?.message || "Invalid credentials. Please try again.";
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
    <section className='flex justify-center items-center w-full h-[810px] '>
        <AuthMarquee />
        <span className='h-full w-1/2 flex justify-center items-center py-20'>
            <div className='w-lg h-[500px] sm:mb-0 mb-20'>
                <div className='flex items-center gap-x-2.5 mb-8 sm:pl-25 pl-9'>
                    <img src={logo} width={45} />
                    <h1 className='text-2xl font-semibold'>CineScope</h1>
                </div>

                <div className='space-y-1 mb-6'>
                    <h1 className='text-4xl font-bold '>Welcome back</h1>
                    <p className='text-lg dark:text-white/60 font-medium'>Start exploring cinema</p>
                </div>

                <form onSubmit={handleLogIn} className='flex flex-col gap-y-4 sm:w-[80%] w-[100%]'>
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
                        <label htmlFor="password" className='text-sm font-medium dark:text-white/80'>Password</label>
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
                        <p onClick={() => navigate('/forgetPassword')} className='text-xs dark:text-[#5fa2fa] text-blue-600 text-right mt-0.5 cursor-pointer hover:text-blue-300 transition-colors'>
                            Forgot password?
                        </p>
                    </div>
                    <button
                        disabled={!isFormValid}
                        type='submit'
                        className={`${isFormValid ? "bg-[#5fa2fa]" : "bg-[#5fa2fa] cursor-not-allowed"} hover:bg-blue-600 active:bg-blue-600 text-white font-semibold rounded-lg py-3 mt-2 transition-colors`}
                    >
                        Log in
                    </button>
                    <p className='text-center dark:text-white/60 text-sm'>
                        Don't have an account?{' '}
                        <span onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            navigate('/signup');
                        }} className='dark:text-[#5fa2fa] text-blue-600 hover:text-blue-300 cursor-pointer transition-colors'>Register</span>
                    </p>
                </form>
            </div>
        </span>
    </section>
)
}

export default Login;